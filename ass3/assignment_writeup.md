# Assignment Write-up: Dynamic Web Application Development

## Aim
To design and develop a dynamic, responsive web application for restaurant discovery (similar to an E-Commerce product listing), utilizing HTML5, CSS3, and JavaScript to demonstrate modern front-end development principles.

## Objective
1. **Structural Design**: To create a semantically structured and accessible user interface using HTML5.
2. **Responsive Styling**: To implement a detailed and responsive design using CSS3, ensuring the application adapts seamlessly to various screen sizes (desktop, tablet, and mobile) without relying on external frameworks.
3. **Dynamic Interactivity**: To utilize JavaScript for rendering content dynamically, allowing the application to display data (restaurant listings) based on user interactions.
4. **Functional Logic**: To implement core e-commerce-like features such as search functionality and category filtering (e.g., by cuisine) to enhance the user experience.

## Theory

### 1. HTML5 (HyperText Markup Language)
HTML5 serves as the structural backbone of the web application. In this project, semantic tags were prioritized to ensure code readability and accessibility.
- **Semantic Elements**: Tags like `<header>`, `<nav>`, `<main>`, `<section>`, and `<footer>` were used to define the logical structure of the page.
- **Forms**: Input fields were used for the search bar, allowing users to interact with the application logic.

### 2. CSS3 (Cascading Style Sheets)
CSS3 was used to handle the presentation and layout of the application. The design focuses on user experience (UX) and visual appeal.
- **Responsive Design**: Media queries (`@media`) were implemented to adjust styles based on the device's viewport width. For example, the restaurant grid shifts from a 4-column layout on desktops to a single-column layout on mobile devices.
- **Flexbox and Grid**: Modern layout models were employed. Flexbox handled one-dimensional layouts (e.g., navigation bar alignment), while CSS Grid handled two-dimensional layouts (e.g., restaurant card grids).
- **CSS Variables**: Global variables (`:root`) were defined for colors and fonts, ensuring a consistent theme throughout the application and making maintenance easier.

### 3. JavaScript (ES6+)
JavaScript provided the dynamic behavior that transforms a static webpage into a web application.
- **Data Structure**: An array of objects (`const restaurants = [...]`) acts as a mock database, storing details like ID, name, cuisine, rating, and image URLs.
- **DOM Manipulation**: The application programmatically creates HTML elements for each restaurant card and injects them into the DOM. This allows the content to update instantly without reloading the page.
- **Event Handling**: Event listeners attach logic to user actions, such as clicking the "Search" button or selecting a filter checkbox.
- **Filtering Logic**: The application uses array methods like `.filter()` and `.map()` to process the data based on user input (e.g., showing only "Italian" restaurants) and update the view accordingly.

## Conclusion
The assignment successfully achieved the goal of designing a dynamic web application. The resulting "Culinary Journey" project functions as a responsive restaurant finder and discovery platform. By integrating HTML for structure, CSS for responsive design, and JavaScript for logic, the application mimics core functionalities of e-commerce platforms, such as product listings and filtering. The project demonstrates a strong grasp of client-side web development technologies and the ability to create creating interactive, user-centric interfaces.
