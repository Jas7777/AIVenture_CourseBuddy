// add courses to selector
const courseList = document.getElementById("courses-list-internal");
const courseListEntryTemplate = document.getElementById("course-list-entry");
const courseTrayTemplate = document.getElementById("course-tray-template");

const SUBJECT_COLOR_CLASSES = {
    "Math": "course-math",
    "Science": "course-science",
    "English": "course-english",
    "Social Science": "course-social-science",
    "World Language": "course-world-language",
    "Elective": "course-elective",
    "Arts": "course-arts",
    "Physical Education": "course-PE",
    "Health Education": "course-health",
    "Career Technical Education": "course-CTE",
    "AVID": "course-AVID"
};

const addCourse = (course, tray) => {

    // add class to the correct tray (declared later in the script)
    trays[tray].add(course);
    saveSelection();

    // create element
    const template = courseTrayTemplate.content.cloneNode(true);
    const trayEntry = template.querySelector(".course");
    trayEntry.querySelector(".course-title").textContent = course.title + ` (${course.ucCategory})`;
    trayEntry.querySelector(".course-subject").textContent = course.subject;
    trayEntry.querySelector(".course-credits").textContent = course.credits;
    trayEntry.classList.add(SUBJECT_COLOR_CLASSES[course.subject]);

    // add logic for close button
    trayEntry.querySelector(".close-button").addEventListener("click", () => {
        trayEntry.remove();
        trays[tray].delete(course);
        course.trayEntry = null;
        saveSelection();
        refreshFilters();
        updateStats();
    });

    // append and close dialog
    course.trayEntry = trayEntry;
    document.getElementById("tray" + tray).append(trayEntry);
    updateStats();
    refreshFilters();

};

// set up the course list in the couse selection dialog
for(const course of COURSES) {

    // fill in fields
    const entry = courseListEntryTemplate.content.cloneNode(true);
    entry.querySelector("h3").append(course.title);
    entry.querySelector(".course-stats").append(course.credits, " \u2022 ", course.ucCategory != "n/a" ? `Fulfills UC/CSU ${course.ucCategory.toUpperCase()} requirement` : "Does not fulfill any UC/CSU requirements");
    entry.querySelector(".course-description").append(course.description);
    entry.querySelector(".course-footnote").append(course.footnotes);
    entry.querySelector(".course-prereqs").append(course.prereqs);

    // assign a color
    entry.firstElementChild.classList.add(SUBJECT_COLOR_CLASSES[course.subject]);
    
    // add link
    entry.querySelector("a").addEventListener("click", () => addCourse(course, curTray));

    // add the entry
    course.entry = entry.querySelector(".course-list-entry");
    courseList.append(entry);

}

// update filters
const schoolFilter = document.getElementById("filter-school"),
      gradeLevelFilter = document.getElementById("filter-grade-level"),
      subjectAreaFilter = document.getElementById("filter-subject-area"),
      ucReqsFilter = document.getElementById("filter-uc-req"),
      searchbar = document.getElementById("search");

const refreshFilters = () => {
    
    // grab filter values from the DOM
    const school = schoolFilter.querySelector(":checked").value;
    const grades = [...gradeLevelFilter.querySelectorAll(":checked")].map(node => node.value);
    const subjects = [...subjectAreaFilter.querySelectorAll(":checked")].map(node => node.value);
    const ucReqs = [...ucReqsFilter.querySelectorAll(":checked")].map(node => node.value);

    // only apply filter if at least one member of the group was selected
    // eg if the user doesn't specify *any* UC reqs to filter by, ignore them
    // (also, filter out already added courses)
    let courses = COURSES.filter(course => !course.trayEntry && course.schools.includes(school));
    if(subjects.length > 0) courses = courses.filter(course => subjects.includes(course.subject));
    if(ucReqs.length > 0) courses = courses.filter(course => ucReqs.includes(course.ucCategory));
    if(grades.length > 0) courses = courses.filter(course => {
        for(const grade of grades) {
            if(course.gradesAvailable.includes(Number(grade))) return true;
        }
    });

    // apply search filters
    const search = searchbar.value.trim().replace(/\s+/, " ");
    if(search.length >= 3) {
        const regex = new RegExp(search, "i")
        courses = courses.filter(course => course.title.match(regex));
    }

    // update element visibility
    for(const course of COURSES) {
        course.entry.style.display = courses.includes(course) ? "" : "none";
    }

    // update courses count text
    document.getElementById("courses-count").textContent = `Courses (${courses.length})`;

};

// attach event listeners for filters
schoolFilter.querySelectorAll("input").forEach(node => node.addEventListener("input", refreshFilters));
gradeLevelFilter.querySelectorAll("input").forEach(node => node.addEventListener("input", refreshFilters));
subjectAreaFilter.querySelectorAll("input").forEach(node => node.addEventListener("input", refreshFilters));
ucReqsFilter.querySelectorAll("input").forEach(node => node.addEventListener("input", refreshFilters));
searchbar.addEventListener("input", refreshFilters);

// select course modal close logic
const modalLayer = document.getElementById("modal-layer");
document.getElementById("modal-close").addEventListener("click", () => modalLayer.style.display = "none");

window.addEventListener("keydown", (event) => {
    if(event.key == "Escape") {
        modalLayer.style.display = "none";
    }
});

// course-adding logic
let curTray = 0; // which tray to add classes to
const trays = [new Set(), new Set(), new Set(), new Set()];

const add = tray => {
    curTray = tray;
    modalLayer.style.display = "";
};

// credits
const credits = {
    "English": {earned: 0, required: 40},
    "Science": {earned: 0, required: 20},
    "Social Science": {earned: 0, required: 30},
    "Math": {earned: 0, required: 30},
    "Physical Education": {earned: 0, required: 20},
    "CTE/Fine Arts/World Language": {earned: 0, required: 10},
    "Elective": {earned: 0},
    "Health": {earned: 0, required: 5},
    "Total": {earned: 0, required: 230}
};

// map course subject -> credit
const subjectToCreditCategory = {
    "Math": "Math",
    "Science": "Science",
    "English": "English",
    "Social Science": "Social Science",
    "World Language": "CTE/Fine Arts/World Language",
    "Elective": "Elective",
    "Arts": "CTE/Fine Arts/World Language",
    "Physical Education": "Physical Education",
    "Health Education": "Health",
    "Career Technical Education": "CTE/Fine Arts/World Language"
    // ignore AVID since I don't know what type of credits it awards
};

// create table rows
const creditsTable = document.getElementById("credits-table");
for(const category in credits) {
    const row = document.createElement("tr");
    const subject = document.createElement("td"); subject.textContent = category; row.append(subject);
    const earned = document.createElement("td"); credits[category].cell = earned; row.append(earned);
    const required = document.createElement("td"); required.textContent = credits[category].required; row.append(required);
    earned.style.fontWeight = "bold";
    creditsTable.append(row);
}

const AGRequirements = {
    "A": {earned: 0, required: 2, desc: "History"},
    "B": {earned: 0, required: 4, desc: "English"},
    "C": {earned: 0, required: 3, desc: "Math"},
    "D": {earned: 0, required: 2, recommended: 3, desc: "Science"},
    "E": {earned: 0, required: 2, recommended: 3, desc: "World Language"},
    "F": {earned: 0, required: 1, desc: "Art"},
    "G": {earned: 0, required: 1, desc: "Elective"}
};

// create table rows
const agTable = document.getElementById("ag-table");
for(const category in AGRequirements) {
    const row = document.createElement("tr");
    const requirement = AGRequirements[category];
    const desc = document.createElement("td");
    desc.textContent = `${requirement.required} ${requirement.required != 1 ? "years" : "year"} of ${requirement.desc} (${category})`;
    row.append(desc);
    agTable.append(row);
}

const updateCredits = () => {
    
    // reset credits
    for(const category in credits) credits[category].earned = 0;

    // sum up credits
    for(const tray of trays) {
        for(const course of tray) {

            // parse how many credits the course offers
            const creditsEarned = Number(course.credits.split(" ")[0]);

            // figure out which section the credits should go to
            // this is a rather inexact process; there's limited information on how credits are calculated, and a lot of things are deduced
            console.log(course.subject, subjectToCreditCategory[course.subject]);
            credits[subjectToCreditCategory[course.subject]].earned += creditsEarned;

        }
    }

    // total
    credits["Total"].earned = Object.values(credits).reduce((a,c) => a + c.earned, 0);

    // update cells
    for(const category in credits) {
        const credit = credits[category];
        credit.cell.textContent = credit.earned;
        credit.cell.style.color = credit.earned < credit.required ? "#ff0000" : "#4ed44e";
    }

};

const updateAG = () => {



};

const updateStats = () => {
    updateCredits();
    updateAG();
}; 

// save selected classes
const saveSelection = () => {
    localStorage.setItem("courses", JSON.stringify(trays.map(tray => [...tray].map(course => course.courseCode))));
};

// try to restore selection
const storedData = localStorage.getItem("courses");
if(storedData) {
    try {
        const storedCourses = JSON.parse(storedData);
        for(let i = 0; i < storedCourses.length; i++) {
            for(const courseCode of storedCourses[i]) {
                const course = COURSES.find(course => course.courseCode === courseCode);
                addCourse(course, i);
            }
        } 
    } catch(err) {
        console.log("The stored course data was invalid, ignoring...");
    }
}

// init code
updateStats();
refreshFilters();
