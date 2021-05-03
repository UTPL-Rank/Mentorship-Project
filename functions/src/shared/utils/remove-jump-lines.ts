export function RemoveJumpLines(inputText: string) {
    const outputText = inputText.replace(/(\r\n|\n|\r)/gm, "");
    return outputText;
}