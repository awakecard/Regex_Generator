const PATTERNS = [
    {
        "name": "number_single",
        "desc": "any numeric value",
        "pattern": "\\d"
    },
    {
        "name": "number_greedy",
        "desc": "any numeric value one or more times",
        "pattern": "\\d+"
    },
    {
        "name": "number_lazy",
        "desc": "any numeric value zero to one times - due to this being lazy this will always match",
        "pattern": "\\d?"
    },
    {
        "name": "numeric_version_control",
        "desc": "This will turn 2.0.1.3 into \\d(\\.\\d+)+ so it will match regardless of how long the subversions run to",
        "pattern": "\\d(\\.\\d+)+"
    }
    
]