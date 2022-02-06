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

// set up the course list in the couse selection dialog
for(const course of COURSES) {

    // fill in fields
    const entry = courseListEntryTemplate.content.cloneNode(true);
    entry.querySelector("h3").append(course.title);
    entry.querySelector(".course-stats").append(course.credits, " \u2022 ", course.ucCategory != "n/a" ? `Fulfills UC/CSU ${course.ucCategory.toUpperCase()} requirement` : "Does not fulfill any UC/CSU requirements");
    entry.querySelector(".course-description").append(course.description);
    entry.querySelector(".course-prereqs").append(course.prereqs);

    // assign a color
    entry.firstElementChild.classList.add(SUBJECT_COLOR_CLASSES[course.subject]);
    
    // add link
    entry.querySelector("a").addEventListener("click", () => {

        // add class to the correct tray (declared later in the script)
        trays[curTray].push(course);

        // create element
        const template = courseTrayTemplate.content.cloneNode(true);
        const trayEntry = template.querySelector(".course");
        trayEntry.querySelector(".course-title").textContent = course.title;
        trayEntry.querySelector(".course-subject").textContent = course.subject;
        trayEntry.querySelector(".course-credits").textContent = course.credits;
        trayEntry.classList.add(SUBJECT_COLOR_CLASSES[course.subject]);

        // add logic for close button
        trayEntry.querySelector(".close-button").addEventListener("click", () => {
            trayEntry.remove();
            course.trayEntry = null;
            updateStats();
            refreshFilters();
        });

        // append and close dialog
        course.trayEntry = trayEntry;
        document.getElementById("tray" + curTray).append(trayEntry);
        modalLayer.style.display = "none";
        updateStats();
        refreshFilters();

    });

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

// course-adding logic
let curTray = 0; // which tray to add classes to
const trays = [[], [], [], []];

const add = tray => {
    curTray = tray;
    modalLayer.style.display = "";
};

const updateStats = () => {

    // calculate credit requirements for graduation

};

// init code
updateStats();
refreshFilters();