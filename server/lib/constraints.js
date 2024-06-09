let _ = {}

_.username = () => {
    const regex = "[\-\'A-Za-z0-9 ]+";
    const constraints = {
        'presence': {
            'allowEmpty': false
        },
        'type': 'string',
        'format': {
            'pattern': regex,
            'flags': 'i',
            'message': 'username must match the following pattern: ' + regex
        }
    }
    return constraints;
};

_.password = () => {
    const constraints = {
        'presence': {'allowEmpty': false},
        'type': 'string',
        'length': {
            'min': 6,
            'max': 30
        }
    };
    return constraints;
}

module.exports = _;