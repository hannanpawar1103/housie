const ticketGenerator = () => {
  const ticket = Array.from({ length: 3 }, () => new Array(9).fill(null));

  const ticketRange = [
    [1, 10],
    [11, 20],
    [21, 30],
    [31, 40],
    [41, 50],
    [51, 60],
    [61, 70],
    [71, 80],
    [81, 90],
  ];

  const Definerange = ticketRange.map(([min, max]) => {
    const nums = [];
    for (let i = min; i <= max; i++) nums.push(i);
    const randomNums = nums.sort(() => Math.random() - 0.5).slice(0, 3);
    // console.log(randomNums)
    return randomNums;
  });

  for (let col = 0; col < 9; col++) {
    const nums = Definerange[col].sort(() => Math.random() - 0.5);
    // console.log(nums)
    for (let row = 0; row < 3 && nums[row] != undefined; row++) {
      ticket[row][col] = nums[row];
      // console.log(ticket)
    }
  }

  for (let row = 0; row < 3; row++) {
    const filledcols = ticket[row].filter((n) => n != null).length;
    const toremove = filledcols - 5;
    if (toremove > 0) {
      const indices = ticket[row]
        .map((n, i) => (n != null ? i : null))
        .filter((i) => i != null)
        .sort(() => Math.random() - 0.5)
        .slice(0, toremove);
      // console.log(indices);
      for (const i of indices) {
        ticket[row][i] = null;
      }
    }
  }
  return ticket;
  // console.log("ticket",ticket)
};

// ticketGenerator();
export { ticketGenerator };
