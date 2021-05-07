import { DraftInlineStyle, DraftStyleMap } from 'draft-js';

const getStyles = () => {
    var res: DraftStyleMap = {};
    fontSizes.forEach(size => {
        res[`FONT_SIZE_${size}`] = { fontSize: `${size}pt` };
    });
    fontFamilies.forEach(font => {
        res[`FONT_FAMILY_${font.toUpperCase().replace(/\s/g, '_')}`] = { fontFamily: font };
    });
    return res;
}

export const isCrossingStyle = (inlineStyle: string) => {
    if (inlineStyle.includes('FONT_SIZE_'))
        return true;
    if (inlineStyle.includes('FONT_FAMILY_'))
        return true;
    return false;
}

export const getCrossingStyles = (inlineStyle: string, currentStyles: DraftInlineStyle) => {
    var crossingStyles: string[] = [];
    var prefix: string = '';
    if (inlineStyle.includes('FONT_SIZE_')) {
        crossingStyles = [...fontSizes];
        prefix = 'FONT_SIZE_';
    }
    if (inlineStyle.includes('FONT_FAMILY_')) {
        crossingStyles = [...fontFamilies];
        prefix = 'FONT_FAMILY_';
    }
    const res = [];
    for (var i = 0; i < crossingStyles.length; i++) {
        const style = prefix + crossingStyles[i].toUpperCase().replace(/\s/g, '_');
        if (currentStyles.has(style) || style === inlineStyle) {
            res.push(style);
        }
    }
    return res;
        
}

export const fontSizes = ['8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '48', '72'];
export const fontFamilies = ['Arial', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS', 'Georgia', 'Garamond', 'Times New Roman'];

export default getStyles();
