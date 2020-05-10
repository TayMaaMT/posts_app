const CreatQuery = (table, cols) => {
    // beginning of update query
    let query = ['INSERT INTO'];
    query.push(table);
    query.push('(');
    // assigning a number value for parameterized query
    let set1 = [];
    Object.keys(cols).map(function(key) {
        set1.push(key);
    });
    query.push(set1.join(', '));
    query.push(') VALUES (');
    let set2 = [];
    Object.keys(cols).forEach(function(key, i) {
        set2.push('$' + (i + 1));
    });
    query.push(set2.join(', '));
    query.push(')');
    query.push('RETURNING id;');
    return query.join(' ');
}

const SelectQuerytable = (table, cols) => {
    // beginning of select query
    let query = ['SELECT * FROM'];
    query.push(table);
    query.push('WHERE');
    // assigning a number value for parameterized query
    let set = [];
    Object.keys(cols).forEach(function(key, i) {
        set.push(key + ' = $' + (i + 1));
    });

    query.push(set.join(' AND '));
    // Return a complete query string

    return query.join(' ');

}

const DeletQuerytable = (table, cols) => {
    // beginning of select query
    let query = ['DELETE FROM'];
    query.push(table);
    query.push('WHERE');
    // assigning a number value for parameterized query
    let set = [];
    Object.keys(cols).forEach(function(key, i) {
        set.push(key + ' = $' + (i + 1));
    });

    query.push(set.join(' AND '));
    // Return a complete query string

    return query.join(' ');

}


const UpdateQuerytable = (table, data, cols) => {
    // beginning of update query
    let query = ['UPDATE'];
    query.push(table);
    query.push('SET');
    // assigning a number value for parameterized query
    let set = [];
    Object.keys(cols).forEach(function(key, i) {
        set.push(key + ' = ($' + (i + 1) + ')');
    });
    query.push(set.join(', '));
    query.push('WHERE ')
    let set2 = [];
    Object.keys(data).forEach(function(key, i) {
        set2.push(`${key} = ${data[key]}`);
    });

    query.push(set2.join(' AND '));
    // Return a complete query string
    return query.join(' ');
}

module.exports = {
    CreatQuery,
    SelectQuerytable,
    UpdateQuerytable,
    DeletQuerytable
}