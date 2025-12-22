# Remove any previously staged files
rm -rf ./stage
rm ./stage.7z

# Stage files
mkdir stage

# rsync -ax ../data stage
rsync -ax --exclude 'node_modules' --exclude '.next' ../src/nextjs stage

# 7zip
7z a stage.7z ./stage -r

# Remove staged files
rm -rf ./stage

