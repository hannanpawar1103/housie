function patternChecker(ticket , markedNumbers , pattern) {

    switch (pattern) {
        case "topline":
        return ticket[0].every((num) => {
            num === null ? true : markedNumbers.includes(num)
        })
    }

}

export { patternChecker };
