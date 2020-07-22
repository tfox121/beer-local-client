// Convert numbers to words
// copyright 25th July 2006, by Stephen Chapman http://javascript.about.com
// permission to use this Javascript on your web page is granted
// provided that all of the code (including this copyright notice) is
// used exactly as shown (you can change the numbering system if you wish)

// American Numbering System
const th = ['', 'thousand', 'million', 'billion', 'trillion'];
// uncomment this line for English Number System
// var th = ['','thousand','million', 'milliard','billion'];

const dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const numToWords = (number) => {
  let s = number;
  s = s.toString();
  s = s.replace(/[, ]/g, '');
  // eslint-disable-next-line eqeqeq
  if (s != parseFloat(s)) return 'not a number';
  let x = s.indexOf('.');
  if (x === -1) x = s.length;
  if (x > 15) return 'too big';
  const n = s.split('');
  let str = '';
  let sk = 0;
  for (let i = 0; i < x; i += 1) {
    if ((x - i) % 3 === 2) {
      if (n[i] === '1') {
        str += `${tn[Number(n[i + 1])]} `;
        i += 1;
        sk = 1;
      } else if (n[i] !== 0) {
        str += `${tw[n[i] - 2]} `;
        sk = 1;
      }
    } else if (n[i] !== 0) {
      str += `${dg[n[i]]} `;
      if ((x - i) % 3 === 0) str += 'hundred ';
      sk = 1;
    }
    if ((x - i) % 3 === 1) {
      if (sk) str += `${th[(x - i - 1) / 3]} `;
      sk = 0;
    }
  }
  if (x !== s.length) {
    const y = s.length;
    str += 'point ';
    for (let i = x + 1; i < y; i += 1) { str += `${dg[n[i]]} `; }
  }
  return str.replace(/\s+/g, ' ');
};

export default numToWords;
