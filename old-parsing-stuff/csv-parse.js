// super fragile csv parser
module.exports = csv => {
    
    // some state
    const rows = [];
    let quote = false, skip = false;
    let row = [], cur = "";

    for(let i = 0; i < csv.length; i++) {

        const char = csv[i];

        // when delimiter is encountered, start new field
        if(!quote && char === ',') {
            row.push(cur);
            cur = "";
            continue;
        }

        // when newline is encountered, start new row
        if(!quote && char === '\n') {
            if(cur.length > 0) {
                row.push(cur);
            }
            rows.push(row);
            cur = "";
            row = [];
            continue;
        }

        // quote logic
        if(char === '"') {
            if(quote) {
                if(csv[i+1] === '"') {
                    // double quote (quote literal)
                    cur += '"'
                    i++;                    
                } else {
                    quote = false;
                }
            } else {
                quote = true;
            }
            continue;
        }

        cur += char;
        
    }

    return rows;

};