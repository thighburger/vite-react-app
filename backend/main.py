import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from deep_translator import GoogleTranslator

# .env 파일 로드 (상위 디렉토리의 .env 파일)
load_dotenv(dotenv_path="../.env")

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CharacterRequest(BaseModel):
    name: str
    personality: str
    appearance: str

@app.post("/generate-image")
async def generate_image(request: CharacterRequest):
    api_key = os.getenv("SD35_API_KEY")
    if not api_key:
        api_key = os.getenv("VITE_SD35_API_KEY")
        
    if not api_key:
        raise HTTPException(status_code=500, detail="API Key not found")

    # 프롬프트 구성 (한국어)
    korean_prompt = f"여행 메이트의 성격은 '{request.personality}', 외모는 '{request.appearance}'입니다. 메이트의 이미지는 흰 배경으로 합니다. 메이트는 실사가 아닌 애니매이션 캐릭터 느낌으로 생성합니다."
    
    # deep-translator를 사용하여 영문으로 번역
    try:
        final_prompt = GoogleTranslator(source='ko', target='en').translate(korean_prompt)
        print(f"Translated Prompt: {final_prompt}")
    except Exception as e:
        print(f"Translation Error: {str(e)}")
        # 번역 실패시 기본 프롬프트 사용 (에러가 날 수 있음)
        final_prompt = korean_prompt
    
    # Stability AI SD3.5 API 호출
    url = "https://api.stability.ai/v2beta/stable-image/generate/sd3"
    
    payload = {
        "prompt": final_prompt,
        "model": "sd3.5-medium", # 참고 코드에 따라 medium 사용
        "output_format": "jpeg",
        "aspect_ratio": "1:1"
    }
    
    headers = {
        "authorization": f"Bearer {api_key}",
        "accept": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, files={"none": ''}, data=payload)
        
        if response.status_code != 200:
            print(f"API Error: {response.text}")
            error_detail = response.json().get("errors", [response.text])
            raise HTTPException(status_code=response.status_code, detail=f"Stability AI API Error: {error_detail}")
            
        data = response.json()
        
        if "image" not in data:
             raise HTTPException(status_code=500, detail="No image data in response")
             
        # base64 이미지 반환
        return {"image": f"data:image/jpeg;base64,{data['image']}"}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
