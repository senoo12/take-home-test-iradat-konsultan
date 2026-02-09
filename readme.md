<img width="1909" height="947" alt="image" src="https://github.com/user-attachments/assets/d60dc1bc-0fe1-4207-aa64-5976fd0694fc" />
# Salary Management (Consoler) Iradat Konsultan.

Salary Management Iradat is a professional internal management platform designed to streamline attendance tracking and automate the payroll process for consolers. It provides a centralized system to ensure transparency and administrative efficiency.

## Installation General

Install our-project with cmd

For the first step, you need to clone this repository.
```bash
git clone https://github.com/senoo12/take-home-test-iradat-konsultan.git
cd take-home-test-iradat-konsultan
```

## Installation Backend
Change your directory to folder backend:
```bash
cd backend
```
Install dependency. 
```bash
npm install
```

Configure your Venv.
```bash
cp .env.example .env
# Create your database first in postgress
# Edit .env with your database URL
```

Set up database.
```bash
npm run db:migrate
npx run db:generate
```

Database push:
```bash
npm run db:push
```

Database reset:
```bash
npm run db:reset
```

## Installation Frontend
Change your directory to folder frontend:
```bash
cd frontend
```

Install dependency
```bash
npm install
```

Configure your Venv.
```bash
cp .env.example .env
# Edit .env with your own port (except port 3000)
```

## Usage/Examples 

Run backend server:
```bash
npm start dev
```

Run frontend server:
```bash
npm start run
```

## Authors

- [@senoo12](https://www.github.com/senoo12)

## Screnshoot Apps
Dashboard
<img width="1909" height="929" alt="image" src="https://github.com/user-attachments/assets/162beaf1-9f78-4735-a031-f45e7c746edf" />

Data Consolers
<img width="1911" height="932" alt="image" src="https://github.com/user-attachments/assets/fc20a060-cbb4-494a-890a-a12f7e3403be" />

Data Events
<img width="1909" height="947" alt="image" src="https://github.com/user-attachments/assets/5e4386a9-4505-43f1-998a-3671a5ec4b9c" />

Data Attendances
<img width="1919" height="932" alt="image" src="https://github.com/user-attachments/assets/28b2e5a8-2056-4429-996c-4f3ddfcc1983" />

Detail Attendance
<img width="1912" height="940" alt="image" src="https://github.com/user-attachments/assets/1ff12172-54c2-4c1d-84cb-5c191dc3010e" />

Salaries
<img width="1906" height="933" alt="image" src="https://github.com/user-attachments/assets/1f65a548-9191-4a8c-bc14-7b2caa5e3572" />

Salaries [Pending Payment]
<img width="1910" height="931" alt="image" src="https://github.com/user-attachments/assets/233a77f4-30a0-47e3-9f08-58e5ae75da71" />

Salaries [History Paid]
<img width="1918" height="934" alt="image" src="https://github.com/user-attachments/assets/e6c0baa7-455c-458d-93d7-a20b964998d6" />
