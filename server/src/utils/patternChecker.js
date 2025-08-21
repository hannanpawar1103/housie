function patternChecker(ticket, markedNumbers, pattern) {
  switch (pattern) {
    case "topline":
      return ticket[0].every((num) => {
        num === null ? true : markedNumbers.includes(num);
      });

    case "middleline":
      return ticket[1].every((num) => {
        num === null ? true : markedNumbers.includes(num);
      });

    case "bottomline":
      return ticket[2].every((num) => {
        num === null ? true : markedNumbers.includes(num);
      });

    case "fullhouse":
      return ticket.flat().every((num) => num === nul ? true : markedNumbers.includes(num));


    default:
      return false;
  }
}

export { patternChecker };
