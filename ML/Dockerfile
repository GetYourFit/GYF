FROM pytorch/pytorch:2.2.2-cuda11.8-cudnn8-runtime

WORKDIR /app

# Install required system libraries (for OpenCV, Pillow, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .

# It's better to install CuPy matching the CUDA version
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir cupy-cuda11x

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
