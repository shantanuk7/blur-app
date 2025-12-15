# Jenkins & Kubernetes Setup Guide

Follow these steps to deploy your project on the college infrastructure.

## 1. Push to GitHub
Ensure all your latest changes (including the new `k8s/` folder and `Jenkinsfile`) are pushed to your GitHub repository.

## 2. Configure Jenkins Credentials
Login to Jenkins and go to **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials (unrestricted)** -> **Add Credentials**.

You need to create the following **Secret Text** credentials. Make sure the "ID" matches exactly.

| ID | Type | value (Example/Instruction) |
|----|------|-----------------------------|
| `sonar-token-2401106` | Secret Text | Your SonarQube User Token (Generate this in SonarQube) |
| `mongo-uri-2401106` | Secret Text | Your MongoDB Atlas Connection String |
| `jwt-secret-2401106` | Secret Text | Any secure random string (e.g., `mysecretkey`) |

## 3. Verify Nexus Credentials
**Important:** The current `Jenkinsfile` uses default credentials (`admin` / `Changeme@2025`) for Nexus.
If your college provided you with a personal Nexus login:
1.  Open `Jenkinsfile`.
2.  Find the `stage('Login to Nexus Registry')` and update the `docker login` command.
3.  Find the `stage('Create Namespace + Secrets')` and update the `kubectl create secret docker-registry` command.

## 4. Create Jenkins Pipeline
1.  On Jenkins Dashboard, click **New Item**.
2.  Enter a name (e.g., `2401106-blur-app`).
3.  Select **Pipeline** and click **OK**.
4.  Scroll to **Pipeline** section.
5.  **Definition**: `Pipeline script from SCM`.
6.  **SCM**: `Git`.
7.  **Repository URL**: Your GitHub Repository URL.
8.  **Branch Specifier**: `*/main` (or `*/master`).
9.  **Script Path**: `Jenkinsfile` (Default).
10. Click **Save**.

## 5. Run the Pipeline
1.  Click **Build Now**.
2.  Monitor the build stages.
3.  Once "Deploy to Kubernetes" is green, your app should be live.

## 6. Access Your App
- **Address**: `http://2401106.imcc.com`
