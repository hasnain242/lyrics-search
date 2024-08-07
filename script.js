const searchform = document.getElementById("form");
const searchinput = document.getElementById("search");
const pagination = document.getElementById("pagination");
const results = document.getElementById("results");
const apiurl = "https://api.lyrics.ovh";

async function search(searchtext) {
  const res = await fetch(`${apiurl}/suggest/${searchtext}`);
  const data = await res.json();
  showdata(data);
}
function showdata(data) {
  results.innerHTML = `
  <ul class="songs">
         ${data.data
           .map(
             (song) => `
                      <li>
                          <span>${song.artist.name}-${song.title}</span>
                          <button class="btn" data-artist="${song.artist.name}" data-title="${song.title}">get lyrics</button>
                      </li>
                    `
           )
           .join("")}
    </ul>
`;
  if (data.prev || data.next) {
    pagination.innerHTML = `
      ${
        data.prev
          ? `<button class="btn" onClick="getmoresongs('${data.prev}')">prev</button>`
          : ""
      }
      ${
        data.next
          ? `<button class="btn" onClick="getmoresongs('${data.next}')">next</button>`
          : ""
      }
    `;
  } else {
    pagination.innerHTML = "";
  }
}
async function getmoresongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  showdata(data);
}
async function getlyrics(artist, title) {
  const res = await fetch(`${apiurl}/v1/${artist}/${title}`);
  const data = await res.json();
   const lyrics = data.lyrics.replace(/(\n\r|\n|\r)/g, '<br>');
  console.log(lyrics);
  
  results.innerHTML = `
    <h2>${artist}-${title}</h2>
    <span>${lyrics}</span>
    `;
  pagination.innerHTML = "";
}
searchform.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchtext = searchinput.value.trim();
  if (!searchtext) {
    alert("please input valid search text");
  } else {
    search(searchtext);
  }
});
results.addEventListener("click", (e) => {
  const clickedelement = e.target;
  if (clickedelement.tagName === "BUTTON") {
    const artist = clickedelement.getAttribute("data-artist");
    const title = clickedelement.getAttribute("data-title");
    getlyrics(artist, title);
  }
});
