import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon("postgresql://fluentlydb_owner:a7u4pqTDHRfE@ep-weathered-glitter-a5w3yyp1.us-east-2.aws.neon.tech/fluentlydb?sslmode=require"!);
// @ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.userSubscription);

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "French",
        imageSrc: "/fr.svg",
      },
      {
        id: 2,
        title: "Italian",
        imageSrc: "/it.svg",
      },
      {
        id: 3,
        title: "Spanish",
        imageSrc: "/es.svg",
      },
      {
        id: 4,
        title: "Croatian",
        imageSrc: "/hr.svg",
      },
    ]);

    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1, // French
        title: "Unit 1",
        description: "Learn the basics of French",
        order: 1,
      },
    ]);

    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1, // Unit 1 (Learn the basics...)
        order: 1,
        title: "Greetings and Introductions",
      },
      {
        id: 2,
        unitId: 1, // Unit 1 (Learn the basics...)
        order: 2,
        title: "Nouns and Verbs",
      },
      {
        id: 3,
        unitId: 1, // Unit 1 (Learn the basics...)
        order: 3,
        title: "Verbs",
      },
      {
        id: 4,
        unitId: 1, // Unit 1 (Learn the basics...)
        order: 4,
        title: "Verbs",
      },
      {
        id: 5,
        unitId: 1, // Unit 1 (Learn the basics...)
        order: 5,
        title: "Verbs",
      },
    ]);

    await db.insert(schema.challenges).values([
      
      {
        id: 1,
        lessonId: 1, 
        type: "FLASHCARD",
        order: 1,
        question: 'Click to review flashcards',
      },

      {
        id: 2,
        lessonId: 1, 
        type: "DRAG",
        order: 2,
        question: 'Click to order',
        correctOrder: ['Bonjour','Comment ça va?','Ça va bien, merci.','Et toi?']
      },
      
      {
        id: 3,
        lessonId: 1, 
        type: "ASSIST",
        order: 3,
        question: '"Je mappelle..."',
      },
      
      {
        id: 4,
        lessonId: 1, 
        type: "SELECT",
        order: 4,
        question: 'Which one of these is "Ça va bien, merci"?',
      },
      {
        id: 5,
        lessonId: 1, 
        type: "ASSIST",
        order: 5,
        question: '"Enchanté"',
      },

     
      {
        id: 6,
        lessonId: 1, 
        type: "SELECT",
        order: 6,
        question: 'Which one of these is "Et toi?"?',
      },
      
      {
        id: 7,
        lessonId: 1, 
        type: "ASSIST",
        order: 7,
        question: '"bonjour"',
      },
      
      {
        id: 8,
        lessonId: 1, 
        type: "SELECT",
        order: 8,
        question: 'Which one of these is "Salut"?',
      },
   

      // {
      //   id: 9,
      //   lessonId: 1,
      //   type: "DRAG",
      //   order: 9,
      //   question: '',
      //   correctOrder: ['Comment ça va?','Ça va bien, merci.','Et toi?']
      // },
      {
        id: 9,
        lessonId: 1, 
        type: "SELECT",
        order: 9,
        question: 'Which one of these is "merci"?',
      },
      {
        id: 10,
        lessonId: 1, // Nouns
        type: "EXAMPLE",
        order: 10,
        question: 'Hover over word to see translation. Click to hear audio.',
      },

      // {
      //   id: 12,
      //   lessonId: 1,
      //   type: "DRAG",
      //   order: 12,
      //   question: '',
      //   correctOrder: ['Bonjour', 'Comment ça va?', 'Ça va bien, merci.', 'Et toi?']
      // },
      {
        id: 11,
        lessonId: 1, 
        type: "SELECT",
        order: 11,
        question: 'Which one of these is "Et toi"?',
      },
      {
        id: 12,
        lessonId: 1, 
        type: "ASSIST",
        order: 12,
        question: '"Je mappelle"',
      },
      // {
      //   id: 15,
      //   lessonId: 1,
      //   type: "DRAG",
      //   order: 15,
      //   question: '',
      //   correctOrder: ['Bonjour','Salut','Comment ça va?', 'Ça va bien, merci.','Je mappelle Felipe. Et toi?','Enchanté Felipe. Je mappelle Alex.']
      // },
    ]);





///////////////////////////////////////////////////////////////////////////////////////////////


await db.insert(schema.challengeOptions).values([
  {
    challengeId: 1, // flashcards
    imageSrc: "/hello.svg",
    correct: false,
    text: "Bonjour",
    audioSrc: "/audio/Bonjour.mp3",
    translation: "Hello"
  },
  {
    challengeId: 1,
    imageSrc: "/hi.svg",
    correct: false,
    text: "Salut",
    audioSrc: "/audio/Salut.mp3",
    translation: "Hi"
  },
  {
    challengeId: 1,
    imageSrc: "/how-are-you.svg",
    correct: false,
    text: "Comment ça va?",
    audioSrc: "/audio/Comment ca va .mp3",
    translation: "How are you?"
  },
  {
    challengeId: 1,
    imageSrc: "/good.svg",
    correct: false,
    text: "Ça va bien, merci.",
    audioSrc: "/audio/ca va bien merci .mp3",
    translation: "I am fine, thank you."
  },
  {
    challengeId: 1,
    imageSrc: "/name.svg",
    correct: false,
    text: "Je m'appelle...",
    audioSrc: "/audio/Je m appelle.mp3",
    translation: "My name is..."
  },
  {
    challengeId: 1,
    imageSrc: "/handshake.svg",
    correct: false,
    text: "Enchanté",
    audioSrc: "/audio/Enchante.mp3",
    translation: "Nice to meet you"
  },
  {
    challengeId: 1,
    imageSrc: "/and-you.svg",
    correct: false,
    text: "Et toi?",
    audioSrc: "/audio/Et toi .mp3",
    translation: "And you?"
  },
]);



//drag
await db.insert(schema.challengeOptions).values([
  {
    challengeId: 2, // "Order these": ['Bonjour', 'Comment ça va?', 'Ça va bien, merci.', 'Et toi?']
    correct: false,
    text: "Comment ça va?",
    audioSrc: "/audio/Comment ca va .mp3",
  },
  {
    challengeId: 2,
    correct: false,
    text: "Et toi?",
    audioSrc: "/audio/Et toi.mp3",
  },
  {
    challengeId: 2,
    correct: false,
    text: "Ça va bien, merci.",
    audioSrc: "/audio/ca va bien.mp3",
  },
  {
    challengeId: 2,
    correct: false,
    text: "Bonjour",
    audioSrc: "/audio/Bonjour.mp3",
  },
]);



// //assist
// await db.insert(schema.challengeOptions).values([
//   {
//     challengeId: 2, // '"Comment ça va?"
//     correct: false,
//     text: "I'm fine, thank you.",
//     audioSrc: "/audio/ca va bien merci .mp3",
//   },
//   {
//     challengeId: 2,
//     correct: true,
//     text: "How are you?",
//     audioSrc: "/audio/Comment ca va .mp3",
//   },
//   {
//     challengeId: 2,
//     correct: false,
//     text: "Nice to meet you.",
//     audioSrc: "/audio/Enchante.mp3",
//   },
// ]);

//assist
await db.insert(schema.challengeOptions).values([
  {
    challengeId: 3, // jmappelle
    correct: false,
    text: "I'm fine, thank you.",
    audioSrc: "/audio/ca va bien merci .mp3",
  },
  {
    challengeId: 3,
    correct: false,
    text: "And you...",
    audioSrc: "/audio/Et toi.mp3",
  },
  {
    challengeId: 3,
    correct: true,
    text: "My name is...",
    audioSrc: "/audio/Je m appelle.mp3",
  },
]);

//select
await db.insert(schema.challengeOptions).values([
  {
    challengeId: 4, //'Which one of these is "Ça va bien, merci"?'
    imageSrc: "/and-you.svg",
    correct: false,
    text: "And you?",
    audioSrc: "/audio/Et toi.mp3",
  },
  {
    challengeId: 4,
    imageSrc: "/good.svg",
    correct: true,
    text: "Ça va bien, merci",
    audioSrc: "/audio/ca va bien merci .mp3",
  },
  {
    challengeId: 4,
    imageSrc: "/handshake.svg",
    correct: false,
    text: "Nice to meet you",
    audioSrc: "/audio/Enchante.mp3",
  },
]);


//assist
await db.insert(schema.challengeOptions).values([
  {
    challengeId: 5, //  '"Nice to meet you"'
    correct: false,
    text: "Et toi",
    audioSrc: "/audio/Et toi.mp3",
  },
  {
    challengeId: 5,
    correct: false,
    text: "Ça va bien, merci",
    audioSrc: "/audio/ca va bien merci .mp3",
  },
  {
    challengeId: 5,
    correct: true,
    text: "Enchanté",
    audioSrc: "/audio/Enchante.mp3",
  },
]);


//select
await db.insert(schema.challengeOptions).values([
  {
    challengeId: 6, //    'Which one of these is "Et toi?"?'

    imageSrc: "/and-you.svg",
    correct: true,
    text: "And you?",
    audioSrc: "/audio/Et toi.mp3",
  },
  {
    challengeId: 6,
    imageSrc: "/thank-you.svg",
    correct: false,
    text: "Thank you",
    audioSrc: "/audio/merci.mp3",
  },
  {
    challengeId: 6,
    imageSrc: "/good.svg",
    correct: false,
    text: "I'm good",
    audioSrc: "/audio/ca va bien.mp3",
  },
]);



//assist
await db.insert(schema.challengeOptions).values([
  {
    challengeId: 7, //'"bonjour"'
    correct: false,
    text: "Hi",
    audioSrc: "/audio/Salut.mp3",
  },
  {
    challengeId: 7,
    correct: false,
    text: "And you?",
    audioSrc: "/audio/Et toi.mp3",
  },
  {
    challengeId: 7,
    correct: true,
    text: "Hello",
    audioSrc: "/audio/Bonjour.mp3",
  },
]);



//select
await db.insert(schema.challengeOptions).values([
  {
    challengeId: 8, //  'Which one of these is "salut"?'
   
    imageSrc: "/thank-you.svg",
    correct: false,
    text: "Thank you",
    audioSrc: "/audio/merci.mp3",
  },
  {
    challengeId: 8,
    imageSrc: "/hi.svg",
    correct: true,
    text: "Hi",
    audioSrc: "/audio/Salut.mp3",
  },
  {
    challengeId: 8,
    imageSrc: "/hello.svg",
    correct: false,
    text: "Hello",
    audioSrc: "/audio/Bonjour.mp3",
  },
]);



// //drag
// await db.insert(schema.challengeOptions).values([
//   {
//     challengeId: 9, // "Order these" :  ['Comment ça va?','Ça va bien, merci.','Et toi?']?'
//     imageSrc: "/good.svg",
//     correct: false,
//     text: "Ça va bien, merci.",
//     audioSrc: "/audio/ca va bien merci .mp3",
//   },
//   {
//     challengeId: 9,
//     imageSrc: "/and-you.svg",
//     correct: false,
//     text: "Et toi?",
//     audioSrc: "/audio/Et toi.mp3",
//   },
//   {
//     challengeId: 9,
//     imageSrc: "/how-are-you.svg",
//     correct: true,
//     text: "Comment ça va?",
//     audioSrc: "/audio/Comment ca va .mp3",
//   },
// ]);




//select
await db.insert(schema.challengeOptions).values([
  {
    challengeId: 9, //'Which one of these is "merci"?'
    imageSrc: "/handshake.svg",
    correct: false,
    text: "Nice to meet you!",
    audioSrc: "/audio/Enchante.mp3",
  },
  {
    challengeId: 9,
    imageSrc: "/name.svg",
    correct: false,
    text: "My name is...",
    audioSrc: "/audio/Je m appelle.mp3",
  },
  {
    challengeId: 9,
    imageSrc: "/thank-you.svg",
    correct: true,
    text: "Thank you",
    audioSrc: "/audio/merci.mp3",
  },
]);

  
//example
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 10, //example sentence
   
        correct: false,
        text: "Bonjour",
        audioSrc: "/audio/Bonjour.mp3",
        translation: "Hello",
        pronunciation: "Bon-joor"
      },
      {
        challengeId: 10,

        correct: false,
        text: "Comment",
        audioSrc: "/audio/Comment.mp3",
        translation: "How",
        pronunciation: "Co-meh"
      },
      {
        challengeId: 10,
        correct: false,
        text: "ça va?",
        audioSrc: "/audio/ca va.mp3",
        translation: "what will",
        pronunciation: "ze va"
      },
      {
        challengeId: 10,
        correct: false,
        text: "Ça va bien,",
        audioSrc: "/audio/ca va bien.mp3",
        translation: "I am good,",
        pronunciation: "ze va be-yan"
      },
      {
        challengeId: 10,
        correct: false,
        text: "merci.",
        audioSrc: "/audio/merci.mp3",
        translation: "thank you.",
        pronunciation: "mer-si"
      },
      {
        challengeId: 10,
        correct: false,
        text: "Et",
        audioSrc: "/audio/Et toi.mp3",
        translation: "And",
        pronunciation: "eht"
      },
      {
        challengeId: 10,
        correct: false,
        text: "toi?",
        audioSrc: "/audio/Et toi.mp3",
        translation: "you?",
        pronunciation: "twa"
      },

    ]);






//select
await db.insert(schema.challengeOptions).values([
  {
    challengeId: 11, //'Which one of these is "Et toi?"?',
    imageSrc: "/thank-you.svg",
    correct: false,
    text: "Thank you",
    audioSrc: "/audio/merci.mp3",
  },
  {
    challengeId: 11,
    imageSrc: "/and-you.svg",
    correct: true,
    text: "And you?",
    audioSrc: "/audio/Et toi.mp3",
  },
  {
    challengeId: 11,
    imageSrc: "/good.svg",
    correct: false,
    text: "I am good",
    audioSrc: "/audio/ca va bien.mp3",
  },
  {
    challengeId: 11,
    imageSrc: "/hello.svg",
    correct: false,
    text: "Hello",
    audioSrc: "/audio/Bonjour.mp3",
  },
]);


//assist
await db.insert(schema.challengeOptions).values([
  {
    challengeId: 12, // jmappelle
    correct: false,
    text: "I'm fine, thank you.",
    audioSrc: "/audio/ca va bien merci .mp3",
  },
  {
    challengeId: 12,
    correct: false,
    text: "And you...",
    audioSrc: "/audio/Et toi.mp3",
  },
  {
    challengeId: 12,
    correct: true,
    text: "My name is...",
    audioSrc: "/audio/Je m appelle.mp3",
  },
]);

// //drag
// await db.insert(schema.challengeOptions).values([
//   {
//     challengeId: 15, //"Order these": ['Bonjour','Salut','Comment ça va?', 'Ça va bien, merci.','Je mappelle Felipe. Et toi?','Enchanté Felipe. Je mappelle Alex.']
//     correct: false,
//     text: "Bonjour",
//     audioSrc: "/audio/Bonjour.mp3",
//   },
//   {
//     challengeId: 15,
//     correct: false,
//     text: "Ça va bien, merci.",
//     audioSrc: "/audio/ca va bien merci .mp3",
//   },
//   {
//     challengeId: 15,
//     correct: true,
//     text: "Je mappelle Felipe. Et toi?",
//     audioSrc: "/audio/Je mappelle Felipe E.mp3",
//   },
//   {
//     challengeId: 15,
//     correct: true,
//     text: "Salut",
//     audioSrc: "/audio/Salut.mp3",
//   },
//   {
//     challengeId: 15,
//     correct: true,
//     text: "Enchanté Felipe. Je mappelle Alex.",
//     audioSrc: "/audio/Enchante Felipe Fe m.mp3",
//   },
//   {
//     challengeId: 15,
//     correct: true,
//     text: "Comment ça va?",
//     audioSrc: "/audio/Comment ca va .mp3",
//   },

// ]);
   
    
    console.log("Seeding finished");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();
