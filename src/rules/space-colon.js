/*
 * Rule: Check if a space follows the colon on property definitions 
 * By default the rule requires a space follow the colon
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "space-colon",
    name: "Space after property colon",
    desc: "Determine if space after colon is required",
    // Value Options: newline|sameline
    defaultValue: 'space',
    value: undefined,
    messages: {
        'nospace': "No space after the colon is required",
        'space': "One space after the colon is required",
    },

    //initialization
    init: function(parser, reporter) {
        var rule = this;
        var ruleValue = rule.value || rule.defaultValue;
        var isInDeclaration = false;

        parser.addListener("startrule", function(event) {
            isInDeclaration = true;
        });

        parser.addListener("endrule", function(event) {
            isInDeclaration = false;
        });

        parser.addListener("property", function(event) {
            var stream = this._tokenStream;

            if (isInDeclaration && !rule.evaluate(stream)) {
                reporter.report(rule.messages[ruleValue], stream._token.startLine, stream._token.endCol, rule); 
            }
        });

    },

    /**
     * Evaluate rule based on value
     * @param  {stream} stream Stream Token
     * @return {boolean} Determines if rule passes or fails
     */
    evaluate: function(stream) {
        var rule = this;
        var ruleValue = rule.value || rule.defaultValue;

        // Same Line Option
        if (ruleValue === "nospace" && stream.LA(-2) === stream.tokenType('S')) {
            return false;
        }

        // New Line Option [default]
        if (ruleValue === "space" && stream.LA(-2) !== stream.tokenType('S')) {
            return false;
        }

        return true;

    }

});