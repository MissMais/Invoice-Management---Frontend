// import { Box } from '@mui/material'
// import React from 'react'
// import NavBar from '../NavBar'

// const AddCompany = () => {
//   return (
//     <div>
//         <Box sx={{ display: "flex", p: 10 }}>
//         <NavBar />
//         <Box component="main" sx={{ flexGrow: 1 }}>
//                 <h1>Add Company Form Here</h1>
//         </Box>
//         </Box>
//     </div>
//   )
// }

// export default AddCompany




// import React, { useState } from 'react';
// import numberToWords from 'number-to-words';

// const NumberToWordsConverter = () => {
//   const [number, setNumber] = useState('');
//   const [words, setWords] = useState('');

//   const handleChange = (e) => {
//     setNumber(e.target.value);
//   };

//   const convertToWords = () => {
//     if (number) {
//       setWords(numberToWords.toWords(number));
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Number to Words Converter</h1>
//       <input
//         type="number"
//         value={number}
//         onChange={handleChange}
//         placeholder="Enter a number"
//         style={{ padding: '10px', marginRight: '10px' }}
//       />
//       <button onClick={convertToWords} style={{ padding: '10px' }}>
//         Convert
//       </button>
//       {words && (
//         <p style={{ marginTop: '20px' }}>
//           <strong>Words:</strong> {words}
//         </p>
//       )}
//     </div>
//   );
// };

// export default NumberToWordsConverter;


import React, { useState } from 'react';
import numWords from 'num-words';

const NumberToWordsConverter = () => {
  const [number, setNumber] = useState('');
  const [words, setWords] = useState('');

  const handleChange = (e) => {
    setNumber(e.target.value);
  };

  const convertToWords = () => {
    if (number) {
      setWords(numWords(number));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Number to Words Converter</h1>
      <input
        type="number"
        value={number}
        onChange={handleChange}
        placeholder="Enter a number"
        style={{ padding: '10px', marginRight: '10px' }}
      />
      <button onClick={convertToWords} style={{ padding: '10px' }}>
        Convert
      </button>
      {words && (
        <p style={{ marginTop: '20px' }}>
          <strong>Words:</strong> {words} rupees
        </p>
      )}
    </div>
  );
};

export default NumberToWordsConverter;

