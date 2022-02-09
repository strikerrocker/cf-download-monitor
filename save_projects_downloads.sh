BASE_URL="https://cf-download-monitor.vercel.app/api"
curl -s "${BASE_URL}/tracked_projects" | 
jq -c .[] | 
while read id; 
do 
    curl -s "${BASE_URL}/save_project_downloads" -d "projectID=$id"; echo; 
done