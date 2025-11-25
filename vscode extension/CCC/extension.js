const vscode = require('vscode');

function activate(context) {

    const CCC_TAGS = {
        "🔧 FIXME": "🔧 Indicates problematic code that needs fixing.",
        "👀 REVIEW": "👀 Marks code that needs peer review or a second opinion.",
        "❓ QUESTION": "❓ Indicates uncertainty or a question about the implementation.",
        "⚡ OPTIMIZE": "⚡ Suggests places for potential optimization.",
        "📝 NOTE": "📝 Provides additional important information or context.",
        "🩹 HACK": "🩹 Marks a temporary or tricky workaround.",
        "🐞 BUG": "🐞 Highlights known bugs in the code.",
        "⏱️ TEMP": "⏱️ Marks temporary code that will be removed.",
        "🔒 SECURITY": "🔒 Highlights a security-sensitive area of the code.",
        "📉 DEPRECATE": "📉 Marks code that is outdated and should not be used anymore.",
        "📌 TODO": "📌 Marks code that needs to be done or fixed later."
    };

    console.log("CCC extension active");

    const completionProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: "*" },
        {
            provideCompletionItems(document, position) {
                const line = document.lineAt(position).text.trim();

                // Mostra suggerimenti SOLO dentro commenti veri
                if (
                    !line.startsWith("//") &&   // JS, TS, Java, C#, C++, Go
                    !line.startsWith("/*") &&   // block start
                    !line.startsWith("*") &&    // inside block
                    !line.startsWith("#") &&    // Python, Shell, Ruby, YAML
                    !line.startsWith("--") &&   // SQL, Lua, Haskell
                    !line.startsWith(";") &&    // Lisp, Assembly, INI
                    !line.startsWith("%") &&    // Prolog, Erlang
                    !line.startsWith("<!--")    // HTML, XML
                ) {
                    return undefined;
                }

                return Object.keys(CCC_TAGS).map(tag => {
                    const item = new vscode.CompletionItem(tag, vscode.CompletionItemKind.Keyword);
                    item.detail = "CCC Tag";
                    item.documentation = CCC_TAGS[tag];
                    item.insertText = tag + ": ";
                    return item;
                });
            }
        },
        // TRIGGER AUTOMATICI
        "/",    // // e /*
        "*",    // commenti multilinea
        "#",    // python, shell...
        "-",    // SQL --
        ";",    // Lisp, Assembly
        "%",    // Prolog
        "<"     // <!--
    );


    const hoverProvider = vscode.languages.registerHoverProvider(
        { scheme: "file", language: "*" },
        {
            provideHover(document, position) {
                const range = document.getWordRangeAtPosition(position, /\w+/);
                if (!range) return;

                const word = document.getText(range);
                const description = CCC_TAGS[word];

                if (description) {
                    return new vscode.Hover(`**${word}** — ${description}`);
                }
            }
        }
    );

    const disposable = vscode.commands.registerCommand("CCC.author", () => {
        vscode.window.showInformationMessage("https://github.com/Chrisiisx");
    });

    context.subscriptions.push(completionProvider, hoverProvider, disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
