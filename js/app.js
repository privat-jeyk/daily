// js/app.js

const days = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag"
];

/* VORLAGEN */

const templates = [

  {
    t:"Früh D1",
    n:"6 - 11 Uhr",
    start:"06:00",
    end:"11:00"
  },

  {
    t:"Früh D2",
    n:"6 - 14 Uhr",
    start:"06:00",
    end:"14:00"
  },

  {
    t:"Früh D3",
    n:"6 - 15:30 Uhr",
    start:"06:00",
    end:"15:30"
  },

  {
    t:"Spät D1",
    n:"9 - 14 Uhr",
    start:"09:00",
    end:"14:00"
  },

  {
    t:"Spät D2",
    n:"9 - 17 Uhr",
    start:"09:00",
    end:"17:00"
  },

  {
    t:"Spät D3",
    n:"9 - 18:30 Uhr",
    start:"09:00",
    end:"18:30"
  },

  {
    t:"Frei",
    n:"",
    start:"",
    end:""
  },

  {
    t:"Urlaub",
    n:"",
    start:"",
    end:""
  },

  {
    t:"Flur putzen",
    n:"18 - 19 Uhr",
    start:"18:00",
    end:"19:00"
  },

  {
    t:"Flur + Keller putzen",
    n:"18 - 20 Uhr",
    start:"18:00",
    end:"20:00"
  }

];

/* STORAGE */

let data =
JSON.parse(localStorage.getItem("tasks"))
|| {};

let selectedDays = [];

let expandedDays = [];

/* ELEMENTS */

const planner =
document.getElementById("planner");

const daySelect =
document.getElementById("daySelect");

const templateBox =
document.getElementById("templates");

const startInput =
document.getElementById("startDate");

const endInput =
document.getElementById("endDate");

/* DATUM */

startInput.value =
localStorage.getItem("startDate")
|| "";

endInput.value =
localStorage.getItem("endDate")
|| "";

startInput.addEventListener("change",()=>{

  localStorage.setItem(
    "startDate",
    startInput.value
  );

});

endInput.addEventListener("change",()=>{

  localStorage.setItem(
    "endDate",
    endInput.value
  );

});

/* SAVE */

function save(){

  localStorage.setItem(
    "tasks",
    JSON.stringify(data)
  );

}

/* DATUM FORMAT */

function formatDate(dateString){

  if(!dateString) return "";

  const date =
  new Date(dateString);

  return date.toLocaleDateString("de-DE");

}

/* TIMELINE */

function createTimeline(day){

  const timeline =
  document.createElement("div");

  timeline.className = "timeline";

  for(let h = 5; h <= 23; h++){

    const slot =
    document.createElement("div");

    slot.className = "timeline-slot";

    /* ZEIT */

    const label =
    document.createElement("div");

    label.className = "timeline-label";

    label.textContent =
    `${String(h).padStart(2,"0")}:00`;

    slot.appendChild(label);

    /* TASKS */

    data[day].forEach(task => {

      if(!task.start || !task.end)
        return;

      const [startH,startM] =
      task.start.split(":").map(Number);

      const [endH,endM] =
      task.end.split(":").map(Number);

      const startTime =
      startH + startM / 60;

      const endTime =
      endH + endM / 60;

      const current =
      h;

      if(current >= startTime &&
         current < endTime){

        const taskEl =
        document.createElement("div");

        taskEl.className =
        "timeline-task";

        taskEl.innerHTML = `
          <strong>${task.t}</strong>
          <br>
          <small>${task.n}</small>
        `;

        slot.appendChild(taskEl);

      }

    });

    timeline.appendChild(slot);

  }

  return timeline;

}

/* INIT */

function init(){

  planner.innerHTML = "";
  daySelect.innerHTML = "";
  templateBox.innerHTML = "";

  /* TAGE */

  days.forEach(day => {

    if(!data[day]){
      data[day] = [];
    }

    const col =
    document.createElement("div");

    col.className = "day";

    /* HEADER */

    const header =
    document.createElement("div");

    header.className = "day-header";

    const title =
    document.createElement("h3");

    title.textContent = day;

    const toggle =
    document.createElement("button");

    toggle.className = "toggle-btn";

    toggle.textContent =
    expandedDays.includes(day)
    ? "▲"
    : "▼";

    toggle.onclick = () => {

      if(expandedDays.includes(day)){

        expandedDays =
        expandedDays.filter(
          d => d !== day
        );

      }else{

        expandedDays.push(day);

      }

      init();

    };

    header.appendChild(title);
    header.appendChild(toggle);

    col.appendChild(header);

    /* TASKS */

    data[day].forEach((task,index)=>{

      const row =
      document.createElement("div");

      row.className = "task";

      const text =
      document.createElement("div");

      text.innerHTML = `
        <div class="task-title">
          ${task.t}
        </div>

        <div class="task-time">
          ${task.n || ""}
        </div>
      `;

      const del =
      document.createElement("button");

      del.textContent = "x";

      del.onclick = () => {

        data[day].splice(index,1);

        save();
        init();

      };

      row.appendChild(text);
      row.appendChild(del);

      col.appendChild(row);

    });

    /* TIMELINE */

    if(expandedDays.includes(day)){

      col.appendChild(
        createTimeline(day)
      );

    }

    planner.appendChild(col);

  });

  /* DAY BUTTONS */

  days.forEach(day => {

    const btn =
    document.createElement("button");

    btn.textContent = day;

    if(selectedDays.includes(day)){

      btn.classList.add("active");

    }

    btn.onclick = () => {

      if(selectedDays.includes(day)){

        selectedDays =
        selectedDays.filter(
          d => d !== day
        );

      }else{

        selectedDays.push(day);

      }

      init();

    };

    daySelect.appendChild(btn);

  });

  /* TEMPLATES */

  templates.forEach(template => {

    const el =
    document.createElement("div");

    el.className = "template";

    el.innerHTML = `
      <strong>${template.t}</strong>
      <br>
      <small>${template.n}</small>
    `;

    el.onclick = () => {

      if(selectedDays.length === 0){

        alert("Bitte Tage auswählen!");

        return;

      }

      selectedDays.forEach(day => {

        data[day].push({

          t:template.t,
          n:template.n,

          start:template.start,
          end:template.end

        });

      });

      save();
      init();

    };

    templateBox.appendChild(el);

  });

  save();

}

/* AUFGABE HINZUFÜGEN */

document.getElementById("addBtn")
.onclick = () => {

  if(selectedDays.length === 0){

    alert("Bitte Tage auswählen!");

    return;

  }

  const text =
  prompt("Aufgabe:");

  if(!text) return;

  const start =
  prompt("Startzeit (z.B. 14:00)");

  const end =
  prompt("Endzeit (z.B. 16:00)");

  selectedDays.forEach(day => {

    data[day].push({

      t:text,

      n:`${start} - ${end} Uhr`,

      start:start,
      end:end

    });

  });

  save();
  init();

};

/* RESET */

document.getElementById("clearBtn")
.onclick = () => {

  if(!confirm("Alles löschen?"))
    return;

  localStorage.clear();

  data = {};
  selectedDays = [];

  startInput.value = "";
  endInput.value = "";

  init();

};

/* SHARE */

document.getElementById("shareBtn")
.onclick = async () => {

  try{

    const shareElement =
    document.createElement("div");

    shareElement.style.background =
    "#0f172a";

    shareElement.style.color =
    "white";

    shareElement.style.padding =
    "30px";

    shareElement.style.width =
    "1400px";

    shareElement.style.fontFamily =
    "system-ui";

    /* TITEL */

    const title =
    document.createElement("h1");

    title.innerText =
    "📅 Wochenplan";

    title.style.marginBottom =
    "10px";

    shareElement.appendChild(title);

    /* DATUM */

    const date =
    document.createElement("div");

    date.style.marginBottom =
    "25px";

    date.style.opacity =
    "0.8";

    date.innerText =
    `${formatDate(startInput.value)}
     - 
     ${formatDate(endInput.value)}`;

    shareElement.appendChild(date);

    /* GRID */

    const grid =
    document.createElement("div");

    grid.style.display =
    "grid";

    grid.style.gridTemplateColumns =
    "repeat(7,1fr)";

    grid.style.gap =
    "10px";

    /* TAGE */

    days.forEach(day => {

      const card =
      document.createElement("div");

      card.style.background =
      "rgba(255,255,255,0.05)";

      card.style.padding =
      "10px";

      card.style.borderRadius =
      "18px";

      const h =
      document.createElement("h3");

      h.innerText = day;

      h.style.marginBottom =
      "10px";

      card.appendChild(h);

      data[day].forEach(task => {

        const taskEl =
        document.createElement("div");

        taskEl.style.background =
        "rgba(56,189,248,0.15)";

        taskEl.style.padding =
        "8px";

        taskEl.style.marginBottom =
        "8px";

        taskEl.style.borderRadius =
        "10px";

        taskEl.innerHTML = `
          <strong>${task.t}</strong>
          <br>
          <small>${task.n}</small>
        `;

        card.appendChild(taskEl);

      });

      grid.appendChild(card);

    });

    shareElement.appendChild(grid);

    document.body.appendChild(
      shareElement
    );

    /* SCREENSHOT */

    const canvas =
    await html2canvas(
      shareElement,
      {
        backgroundColor:"#0f172a",
        scale:2
      }
    );

    document.body.removeChild(
      shareElement
    );

    /* PNG */

    canvas.toBlob(async(blob)=>{

      const file =
      new File(
        [blob],
        "wochenplan.png",
        {
          type:"image/png"
        }
      );

      /* MOBILE SHARE */

      if(
        navigator.canShare &&
        navigator.canShare({
          files:[file]
        })
      ){

        await navigator.share({

          title:"Wochenplan",

          files:[file]

        });

      }else{

        /* DESKTOP DOWNLOAD */

        const a =
        document.createElement("a");

        a.href =
        URL.createObjectURL(blob);

        a.download =
        "wochenplan.png";

        a.click();

      }

    });

  }catch(err){

    console.error(err);

    alert("Teilen fehlgeschlagen");

  }

};

/* START */

init();
