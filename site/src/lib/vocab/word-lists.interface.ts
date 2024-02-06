export enum ChineseWordLists {
  時代華語1w = '時代華語 Book 1 Words',
  時代華語1c = '時代華語 Book 1 Characters',
  時代華語2Aw = '時代華語 Book 2 L1-L8 Words',
  時代華語2Ac = '時代華語 Book 2 L1-L8 Characters',
  時代華語2Bw = '時代華語 Book 2 L9-L16 Words',
  時代華語2Bc = '時代華語 Book 2 L9-L16 Characters',
  時代華語3Aw = '時代華語 Book 3 L1-L8 Words',
  時代華語3Ac = '時代華語 Book 3 L1-L8 Characters',
  時代華語3Bw = '時代華語 Book 3 L9-L16 Words',
  時代華語3Bc = '時代華語 Book 3 L9-L16 Characters',
  時代華語4Aw = '時代華語 Book 4 L1-L8 Words',
  時代華語4Ac = '時代華語 Book 4 L1-L8 Characters',
  時代華語4Bw = '時代華語 Book 4 L9-L16 Words',
  時代華語4Bc = '時代華語 Book 4 L9-L16 Characters',

  hsk1w = 'HSK 1 Words',
  hsk1c = 'HSK 1 Characters',
  hsk2w = 'HSK 2 Words',
  hsk2c = 'HSK 2 Characters',
  hsk3w = 'HSK 3 Words',
  hsk3c = 'HSK 3 Characters',
  hsk4w = 'HSK 4 Words',
  hsk4c = 'HSK 4 Characters',
  hsk5w = 'HSK 5 Words',
  hsk5c = 'HSK 5 Characters',
  hsk6w = 'HSK 6 Words',
  hsk6c = 'HSK 6 Characters',

  tocflN1w = 'TOCFL Novice 1 Words',
  tocflN1c = 'TOCFL Novice 1 Characters',
  tocflN2w = 'TOCFL Novice 2 Words',
  tocflN2c = 'TOCFL Novice 2 Characters',
  tocfl1w = 'TOCFL Level 1 (A1) Words',
  tocfl1c = 'TOCFL Level 1 (A1) Characters',
  tocfl2w = 'TOCFL Level 2 (A2) Words',
  tocfl2c = 'TOCFL Level 2 (A2) Characters',
  tocfl3w = 'TOCFL Level 3 (B1) Words',
  tocfl3c = 'TOCFL Level 3 (B1) Characters',
  tocfl4w = 'TOCFL Level 4 (B2) Words',
  tocfl4c = 'TOCFL Level 4 (B2) Characters',
  tocfl5w = 'TOCFL Level 5 (C) Words',
  tocfl5c = 'TOCFL Level 5 (C) Characters',

  // hsknew1w = 'HSK-New 1 Words',
  // hsknew1c = 'HSK-New 1 Characters',
  // hsknew2w = 'HSK-New 2 Words',
  // hsknew2c = 'HSK-New 2 Characters',
  // hsknew3w = 'HSK-New 3 Words',
  // hsknew3c = 'HSK-New 3 Characters',
  // hsknew4w = 'HSK-New 4 Words',
  // hsknew4c = 'HSK-New 4 Characters',
  // hsknew5w = 'HSK-New 5 Words',
  // hsknew5c = 'HSK-New 5 Characters',
  // hsknew6w = 'HSK-New 6 Words',
  // hsknew6c = 'HSK-New 6 Characters',
  // hsknew7w = 'HSK-New 7 Words',
  // hsknew7c = 'HSK-New 7 Characters',
  // hsknew8w = 'HSK-New 8 Words',
  // hsknew8c = 'HSK-New 8 Characters',
  // hsknew9w = 'HSK-New 9 Words',
  // hsknew9c = 'HSK-New 9 Characters',
}

enum EnglishWordLists {
  toefl = 'TOEFL', // to study in USA
  toeic = 'TOEIC', // to work in Taiwan
  ielts = 'International English Language Testing System', // to study  in Europe
  tw_7000 = 'Taiwan HS 7000 Words',
}

export type ChineseWordList = keyof typeof ChineseWordLists
export type EnglishWordList = keyof typeof EnglishWordLists
