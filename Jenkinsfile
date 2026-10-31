pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'StockWise source code is checked out from GitHub'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test -- --run'
            }
        }

        stage('Production Build') {
            steps {
                bat 'npm run build'
            }
        }
    }

    post {
        success {
            echo 'StockWise CI Pipeline: SUCCESS'
        }
        failure {
            echo 'StockWise CI Pipeline: FAILED'
        }
    }
}
