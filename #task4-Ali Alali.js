
const database = {
  p1: {
    id: "p1",
    author: { name: "Mira", email: "mira@trendpulse.dev", verified: true },
    content: "Meet @sara at the hub #js #async",
    engagement: { likes: 12, shares: 2, comments: 4 },
    createdAt: "2026-04-01T09:00:00.000Z"
  },
  p2: {
    id: "p2",
    author: { name: "Rami", email: "invalid-email", verified: false },
    content: "Checkout #node tutorials",
    engagement: { likes: 3 },
    createdAt: "2026-04-02T11:30:00.000Z"
  },
   p3: {
    id: "p3",
    author: { name: "ali", email: "invalid--email", verified: false },
    content: "hi #node tutorials",
    engagement: { likes: 4, shares: 3 },
    createdAt: "2026-04-03T11:30:00.000Z"
  }
};
const emailOk = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
const hashTag = /#[\w-]+/g;
const mention = /@[\w-]+/g;

//1-)
function describePostForUi(post) {
  const { author: { name: authorName } } = post
  const mergedPost = { 
    ...post, 
    meta: { channel: "web" } 
  };
   const keysCount = Object.keys(mergedPost).length
return {
    title: post.id,
    authorName: authorName,
    keysCount: keysCount
  }
}
//2-)
function getEngagementTotals(post) {
    return {
    likes: post.engagement?.likes ?? 0,
    shares: post.engagement?.shares ?? 0,
    comments: post.engagement?.comments ?? 0
  }
}
//3-)
function fetchPostById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (database[id]) {
        resolve({ ...database[id] })
      } else {
        reject("id is not in Database, try again")
      }
    }, 1000); 
  })
}
async function demoFetch() {
  try {
    const post = await fetchPostById("p1");
    console.log(post);
  } catch (e) {
      console.log("error is:",e)
  } finally {
    console.log("Hi coach")
  }
}
//4-)
function analyzePostText(post) {
  const emailValid = emailOk.test(post.author.email);
  const tags = post.content.match(hashTag) || ["no tags"];
  const mentions = post.content.match(mention) || ["no mentions"];
  return {
    emailValid: emailValid,
    tags: tags,
    mentions: mentions
  };
}
//5-)
// Predicted print order: 1, 4, 3, 2

//6-)
function formatIsoDateOnly(iso) {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${year}-${month}-${day}`;
}
function startRefreshDemo(onTick) {
  let n = 0;
  const id = setInterval(() => {
    n++;
    onTick(n);
    if (n >= 3) clearInterval(id);
  }, 200);
}
//7-)
async function runTrendPulsePhase2() {
  const ids = Object.values(database).map((v)=>v.id);; 
  let loaded = 0;
  let validEmails = 0;
  let invalidAuthorId = [];
  let datesFormatted = [];
  for (const id of ids) {
    const post = await fetchPostById(id); //await because it's promise it take some time 
    loaded++; 
    if (analyzePostText(post).emailValid) 
      validEmails++; 
    else 
        invalidAuthorId.push(id); 
    const formattedDate = formatIsoDateOnly(post.createdAt);
    datesFormatted.push(formattedDate);
  }
  return{
    loaded: loaded,
    validEmails: validEmails,
    invalidAuthorId: invalidAuthorId,
    datesFormatted: datesFormatted
  }; 
}
//1-)
//  console.log(describePostForUi(database.p1));
//2-)
// console.log(getEngagementTotals(database.p2));
//3-)
// fetchPostById("p1").then((result)=>{
//   console.log(result);
// })
// demoFetch();
//4-)
// console.log(analyzePostText(database.p2));
//5-)
// Predicted print order: 1, 4, 3, 2
//6-)
// console.log(formatIsoDateOnly("2026-04-04T10:00:00.000Z"));
//7-)
// runTrendPulsePhase2().then((result)=>{
//   console.log(result);
// })