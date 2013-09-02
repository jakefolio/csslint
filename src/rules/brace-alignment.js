/*
 * Rule: Check alignment of selectors and end brace 
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "brace-alignment",
    name: "Check alignment of selectors and end brace",
    desc: "Determine if selector column and ending brace match",
    // Value Options: align
    defaultValue: 'align',
    value: undefined,
    messages: {
        'align': "Ending brace does not align with start of selectors",
    },

    //initialization
    init: function(parser, reporter) {
        var rule = this;
        var ruleValue = rule.value || rule.defaultValue;
        var ruleStartCol;
        var ruleStartLine;

        parser.addListener("startrule", function(event) {
            var stream = this._tokenStream;
            
            ruleStartCol = event.col;
            ruleStartLine = event.line;
        });

        parser.addListener("endrule", function(event) {
            var stream = this._tokenStream;

            if (!rule.evaluate(stream, ruleStartCol, ruleStartLine)) {
                reporter.report(rule.messages[ruleValue], stream._token.startLine, stream._token.endCol, rule); 
            }
        });

    },

    /**
     * Evaluate rule based on value
     * @param  {stream} stream Stream Token
     * @param  {integer} ruleStartCol Start position of initial selector
     * @param  {integer} ruleStartLine Start line of initial selector, check for single line declaration
     * @return {boolean} Determines if rule passes or fails
     */
    evaluate: function(stream, ruleStartCol, ruleStartLine) {
        var rule = this;
        var ruleValue = rule.value || rule.defaultValue;
        var token;

        if (stream.tokenName(stream.LA(-2)) === 'RBRACE') {
            token = stream.LT(-1);
        }

        if (stream.tokenName(stream.LA(-3)) === 'RBRACE') {
            token = stream.LT(-2);
        }

        // Columns do not need to match on single line declarations
        if (token.startLine === ruleStartLine) {
            return true;
        }

        // Check if columns match for RBRACE and first selector
        if (ruleStartCol !== token.startCol) {
            return false;
        }

        return true;

    }

});