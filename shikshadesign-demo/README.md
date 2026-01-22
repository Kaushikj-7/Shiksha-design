# Shiksha Design - Program Logic Designer

A specialized tool for educational non-profits to design robust **Logical Framework Analyses (LFA)**. This application guides users through defining problems, outcomes, stakeholder behaviors, and activities, ensuring logical consistency at every step.

## 🚀 Quick Start

1.  **Install Dependencies**: `npm install`
2.  **Run Development Server**: `npm run dev`
3.  **Build for Production**: `npm run build`

## 📋 Reference Inputs for Testing (Foundational Literacy & Numeracy)

Use these inputs to test the application's "Golden Path" for an FLN program.

### Step 1: Program Basics
- **Name**: `Rural FLN Enhancement Project`
- **Description**: `A 3-year intervention improving literacy and numeracy in 500 rural schools.`

### Step 2: Problem & Outcome
- **Core Problem**: `Children in rural districts lack foundational literacy and numeracy (FLN) skills, limiting their future educational and economic opportunities.`
- **Desired Outcome**: `Improved foundational literacy and numeracy skills for primary school children (Grades 1-3) in target rural districts.`
- **Success Indicator**: `% of Grade 3 students achieving grade-level competency in reading and math.`

### Step 3: Stakeholders & Behavior Changes
*Add these groups and their specific desired changes.*

#### **Group 1: Teachers**
| Goal / Behavior | Success Indicator |
| :--- | :--- |
| **Design / Planning**: Plan lessons using FLN-specific pedagogy. | % of lesson plans incorporating FLN strategies. |
| **Routines**: Conduct daily 15-min reading circles. | % of classrooms with daily reading logs active. |
| **Assessment**: Use formative assessments to track student levels. | % of teachers updating tracking data weekly. |
| **Materials**: Use Teaching Learning Materials (TLM) effectively. | Frequency of TLM usage during observations. |

#### **Group 2: Students**
| Goal / Behavior | Success Indicator |
| :--- | :--- |
| **Active Engagement**: Participate actively in group learning activities. | Student engagement scores during observation. |
| **Home Practice**: Read for 20 minutes daily at home. | % of students returning signed home-reading logs. |
| **Attendance**: Attend school regularly. | Average monthly attendance rate (>85%). |

#### **Group 3: Community / Parents**
| Goal / Behavior | Success Indicator |
| :--- | :--- |
| **School Governance**: SMCs monitor teacher and student attendance. | # of SMC meetings held with attendance agenda. |
| **Home Support**: Create a supportive learning environment at home. | % of parents attending quarterly PTMs. |

### Step 4: Activities
*Link these activities to the goals above.*

1.  **Activity**: `Conduct 5-day residential training on FLN pedagogy.`
    *   **Output**: `50 Teachers trained.`
    *   **Link to Goal**: `Teachers - Design / Planning`

2.  **Activity**: `Distribute "Library-in-a-Box" kits to classrooms.`
    *   **Output**: `500 Kits distributed.`
    *   **Link to Goal**: `Teachers - Materials`

3.  **Activity**: `Launch "Reading Festival" community campaigns.`
    *   **Output**: `50 Community meetings held.`
    *   **Link to Goal**: `Community - Home Support`

## 🛠 Deployment to Netlify

1.  Ensure local changes are committed:
    ```bash
    git add .
    git commit -m "Ready for deploy"
    ```
2.  Push to your GitHub repository.
3.  Connect the repository to Netlify.
4.  **Build Command**: `npm run build`
5.  **Publish Directory**: `dist`

