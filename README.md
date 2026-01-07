# 🛒 Modern E-Commerce Platform (Fullstack)

## 📝 Overview
This is a comprehensive e-commerce solution built with a **decoupled architecture**. The project focuses on a high-performance **ASP.NET Core Web API** backend and a dynamic **ReactJS** frontend[cite: 44], delivering a seamless shopping experience from authentication to checkout.

## 🚀 Key Features
* **User Authentication**: Robust security and user management using **Identity Server**.
* **Dynamic Shopping Cart**: Real-time cart updates and persistent storage for user selections.
* **Secure Checkout**: Streamlined payment workflow and order validation.
* [cite_start]**Product Discovery**: Advanced product browsing and detailed viewing for customers[cite: 43].

## 🛠 Tech Stack
* [cite_start]**Backend**: ASP.NET Core Web API 
* [cite_start]**Frontend**: ReactJS & Material UI (MUI)
* [cite_start]**Database**: PostgreSQL 
* [cite_start]**ORM**: Entity Framework Core
* [cite_start]**Security**: Identity Server

## 🏗 System Architecture
* **Backend**: Follows a **3-Tier Architecture** for scalability and maintainability
* **API**: RESTful API design documented with **Swagger**
* **Frontend**: Single Page Application (SPA) utilizing modern hooks and component-based UI.

## 🔧 Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/VuBinhVL/E_Commerce_Web_Basic.git
    ```

2.  **Database Configuration**:
    * [cite_start]Ensure **PostgreSQL** is installed and running[cite: 10, 44].
    * Update the connection string in `appsettings.json`.

3.  **Run Backend**:
    ```bash
    cd API
    dotnet ef database update
    dotnet run
    ```

4.  **Run Frontend**:
    ```bash
    cd client
    npm install
    npm start
    ```

## 👤 Author
* **Ho Tien Vu Binh**
* **Software Engineering Student** at **University of Information Technology (UIT)**
* **Email**: vubinh.2004.17.7@gmail.com 
