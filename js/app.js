/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */
const pageSections = document.querySelectorAll("section");
const nav = document.querySelector(".navbar__menu");
const navList = document.querySelector("#navbar__list");
const navLinks = [];
const burger = document.querySelector(".burger");

/**
 * End Global Variables
 * Start Helper Functions
 *
 */
const getSectionsDataNav = () => {
  let dataNav = [];
  pageSections.forEach((section) => {
    dataNav.push(section.getAttribute("data-nav"));
  });
  return dataNav;
};

const getSectionsID = () => {
  let sectionsID = [];
  pageSections.forEach((section) => {
    sectionsID.push(section.id);
  });
  return sectionsID;
};

const removeActiveClass = (id) => {
  let selector = `a[href="#${id}"]`;
  document.querySelector(selector).classList.remove("active");
  // console.log(document.querySelector(selector));
};

const addActiveClass = (id) => {
  let selector = `a[href="#${id}"]`;
  document.querySelector(selector).classList.add("active");
  // console.log(document.querySelector(selector));
};

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav

const buildNavBarLinks = () => {
  const navFrag = document.createDocumentFragment();

  getSectionsDataNav().forEach((link, index) => {
    const navLi = document.createElement("li");
    const navLink = document.createElement("a");

    navLink.classList.add("menu__link");
    navLink.textContent = link;
    // fill the href for links
    navLink.href = `#${getSectionsID()[index]}`;
    // adding each link to navLinks Array
    navLinks.push(navLink);

    navLi.appendChild(navLink);
    navFrag.appendChild(navLi);
  });
  navList.appendChild(navFrag);
};

// Add navSlide for responsive view

const navSlide = () => {
  burger.addEventListener("click", () => {
    // Toggle Nav
    nav.classList.toggle("navbar__active");

    // Animate Links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${
          index / 7 + 0.2
        }s`;
      }
    });

    // Burrger Animation
    burger.classList.toggle("toggle");
  });
};

// Add class 'active' to section when near top of viewport
let addActiveSection = (entries, sectionObserver) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("your-active-class");
      addActiveClass(entry.target.id);
    } else {
      entry.target.classList.remove("your-active-class");
      removeActiveClass(entry.target.id);
    }
  });
};

// Scroll to anchor ID using scrollTO event
// APPROCH window.requestAnimationFrame()

const smoothScroll = (event) => {
  // event.preventDefault();
  // const id = event.target.getAttribute("href");
  // console.log(document.querySelector(id).offsetTop);
  // window.scrollTo({
  //   top: document.querySelector(id).offsetTop,
  //   behavior: "smooth",
  // });
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute("href");
  const targetPosition = document.querySelector(targetId).offsetTop;
  const startPostion = window.pageYOffset;
  const distance = targetPosition - startPostion;
  const duration = 1000;
  let start;

  // timestamp means currentTime
  let step = (timestamp) => {
    if (start === undefined) start = timestamp;

    const elapsed = timestamp - start;

    window.scrollTo(0, distance * (elapsed / duration) + startPostion); // we can replace with ease function

    // Stop the animation after duration
    if (elapsed < duration) window.requestAnimationFrame(step);
  };

  window.requestAnimationFrame(step);
};

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu

buildNavBarLinks();

// NavSlide for Mobile Version
navSlide();

// Scroll to section on link click

navLinks.forEach((link) => link.addEventListener("click", smoothScroll));

// Set sections as active

let sectionOptions = {
  threshold: 0.6,
  rootMargin: "0px 0px 0px 0px",
};
let sectionObserver = new IntersectionObserver(
  addActiveSection,
  sectionOptions
);
pageSections.forEach((section) => sectionObserver.observe(section));
