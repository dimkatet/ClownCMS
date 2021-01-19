import * as React from 'react';

type Props =
    {
        text: string,
        saveText: (text: string) => void,
        name: string,
        valid?: (value: string) => boolean;
    };

export let TextEditor: React.FC<Props> = (props) => {
    
    return (<div>
        <input type='button' value='add'/>
    </div>
    )
};