import {
    EditorState,
    ContentBlock,
    genKey,
    ContentState
} from 'draft-js';
import { List, Map } from 'immutable';

export const addNewBlockAt = (
    editorState: EditorState,
    pivotBlockKey: string,
    newBlockType = 'unstyled',
    initialData = Map({})
) => {
    const content = editorState.getCurrentContent();
    const blockMap = content.getBlockMap();
    const block = blockMap.get(pivotBlockKey);

    if (!block) {
        throw new Error(`The pivot key - ${pivotBlockKey} is not present in blockMap.`);
    }

    const blocksBefore = blockMap.toSeq().takeUntil((v) => (v === block));
    const blocksAfter = blockMap.toSeq().skipUntil((v) => (v === block)).rest();
    const newBlockKey = genKey();
    const lineBlockKey = genKey();

    const newBlock = new ContentBlock({
        key: newBlockKey,
        type: newBlockType,
        text: '',
        characterList: List(),
        depth: 0,
        data: initialData,
    });

    const lineBlock = new ContentBlock({
        key: lineBlockKey,
        type: 'unstyled',
        text: '',
        characterList: List(),
        depth: 0
    })

    const newBlockMap = blocksBefore.concat(
        [[pivotBlockKey, block], [newBlockKey, newBlock], [lineBlockKey, lineBlock]],
        blocksAfter
    ).toOrderedMap();

    const selection = editorState.getSelection();

    const newContent = content.merge({
        blockMap: newBlockMap,
        selectionBefore: selection,
        selectionAfter: selection.merge({
            anchorKey: newBlockKey,
            anchorOffset: 0,
            focusKey: newBlockKey,
            focusOffset: 0,
            isBackward: false,
        }),
    });

    return EditorState.push(editorState, newContent as ContentState, 'split-block');
};

export const getCurrentBlock = (editorState: EditorState) => {
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    return contentState.getBlockForKey(selectionState.getStartKey());
};
