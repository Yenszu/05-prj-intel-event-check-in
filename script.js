const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");
const progressBar = document.getElementById("progressBar");
const storageKey = "intelSummitCheckIn";

const attendanceTracker =
  document.getElementsByClassName("attendance-tracker")[0];
const teamStats = document.getElementsByClassName("team-stats")[0];
const celebrationMessage = document.createElement("p");
celebrationMessage.className = "celebration-message";
celebrationMessage.style.display = "none";
celebrationMessage.style.maxWidth = "700px";
celebrationMessage.style.width = "90%";
celebrationMessage.style.margin = "0 auto 24px";
celebrationMessage.style.padding = "18px 22px";
celebrationMessage.style.border = "2px solid #00a3e0";
celebrationMessage.style.borderLeft = "6px solid #0071c5";
celebrationMessage.style.borderRadius = "12px";
celebrationMessage.style.backgroundColor = "#e8f4fc";
celebrationMessage.style.color = "#003c71";
celebrationMessage.style.fontSize = "20px";
celebrationMessage.style.fontWeight = "600";
celebrationMessage.style.textAlign = "center";
attendanceTracker.appendChild(celebrationMessage);

const attendeeSection = document.createElement("div");
attendeeSection.className = "attendee-list";
attendeeSection.style.marginTop = "30px";
attendeeSection.style.textAlign = "left";

const attendeeHeading = document.createElement("h3");
attendeeHeading.textContent = "Checked-In Attendees";
attendeeSection.appendChild(attendeeHeading);

const attendeeList = document.createElement("ul");
attendeeList.style.listStyle = "none";
attendeeList.style.margin = "0";
attendeeList.style.padding = "0";
attendeeList.style.border = "1px solid #e2e8f0";
attendeeList.style.borderRadius = "8px";
attendeeList.style.overflow = "hidden";
attendeeSection.appendChild(attendeeList);
teamStats.appendChild(attendeeSection);

let totalAttendees = 0;
let waterAttendees = 0;
let zeroAttendees = 0;
let powerAttendees = 0;
let attendees = [];
let winningTeamName = "";

const savedData = localStorage.getItem(storageKey);

if (savedData !== null) {
  try {
    const attendanceData = JSON.parse(savedData);
    totalAttendees = attendanceData.totalAttendees || 0;
    waterAttendees = attendanceData.waterAttendees || 0;
    zeroAttendees = attendanceData.zeroAttendees || 0;
    powerAttendees = attendanceData.powerAttendees || 0;
    attendees = attendanceData.attendees || [];
    winningTeamName = attendanceData.winningTeamName || "";
  } catch (error) {
    // Start with empty attendance data if the saved data cannot be read.
  }
}

function getTeamName(teamValue) {
  if (teamValue === "water") {
    return "Team Water Wise";
  }
  if (teamValue === "zero") {
    return "Team Net Zero";
  }
  return "Team Renewables";
}

function getWinningTeamName() {
  const highestAttendance = Math.max(
    waterAttendees,
    zeroAttendees,
    powerAttendees,
  );
  const winningTeams = [];

  if (waterAttendees === highestAttendance) {
    winningTeams.push("Team Water Wise");
  }
  if (zeroAttendees === highestAttendance) {
    winningTeams.push("Team Net Zero");
  }
  if (powerAttendees === highestAttendance) {
    winningTeams.push("Team Renewables");
  }

  return winningTeams.join(" and ");
}

function saveAttendance() {
  const attendanceData = {
    totalAttendees: totalAttendees,
    waterAttendees: waterAttendees,
    zeroAttendees: zeroAttendees,
    powerAttendees: powerAttendees,
    attendees: attendees,
    winningTeamName: winningTeamName,
  };

  localStorage.setItem(storageKey, JSON.stringify(attendanceData));
}

function updateAttendanceDisplay() {
  attendeeCount.textContent = totalAttendees;
  waterCount.textContent = waterAttendees;
  zeroCount.textContent = zeroAttendees;
  powerCount.textContent = powerAttendees;

  const progressPercent = Math.min((totalAttendees / 50) * 100, 100);
  progressBar.style.width = `${progressPercent}%`;

  attendeeList.innerHTML = "";

  for (let i = 0; i < attendees.length; i = i + 1) {
    const listItem = document.createElement("li");
    const name = document.createElement("span");
    const team = document.createElement("span");

    name.textContent = attendees[i].name;
    team.textContent = getTeamName(attendees[i].team);
    team.style.color = "#0071c5";
    team.style.fontWeight = "600";
    team.style.textAlign = "right";

    listItem.style.display = "flex";
    listItem.style.justifyContent = "space-between";
    listItem.style.alignItems = "center";
    listItem.style.gap = "12px";
    listItem.style.padding = "12px 16px";
    listItem.style.backgroundColor = "#f8fafc";
    if (i < attendees.length - 1) {
      listItem.style.borderBottom = "1px solid #e2e8f0";
    }

    listItem.appendChild(name);
    listItem.appendChild(team);
    attendeeList.appendChild(listItem);
  }
}

function showCelebration() {
  celebrationMessage.textContent = "Goal reached! Congratulations to ";

  const winningTeam = document.createElement("strong");
  winningTeam.textContent = `${winningTeamName}!`;
  winningTeam.style.color = "#0071c5";
  winningTeam.style.fontWeight = "700";
  celebrationMessage.appendChild(winningTeam);
  celebrationMessage.style.display = "block";
}

updateAttendanceDisplay();

if (totalAttendees >= 50) {
  winningTeamName = getWinningTeamName();
  saveAttendance();
  showCelebration();
}

checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;

  if (attendeeName === "" || selectedTeam === "") {
    return;
  }

  if (
    selectedTeam !== "water" &&
    selectedTeam !== "zero" &&
    selectedTeam !== "power"
  ) {
    return;
  }

  totalAttendees = totalAttendees + 1;

  if (selectedTeam === "water") {
    waterAttendees = waterAttendees + 1;
  } else if (selectedTeam === "zero") {
    zeroAttendees = zeroAttendees + 1;
  } else {
    powerAttendees = powerAttendees + 1;
  }

  attendees.push({ name: attendeeName, team: selectedTeam });

  greeting.textContent = `Welcome, ${attendeeName}!`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  if (totalAttendees === 50) {
    winningTeamName = getWinningTeamName();
    showCelebration();
  }

  updateAttendanceDisplay();
  saveAttendance();

  checkInForm.reset();
});
