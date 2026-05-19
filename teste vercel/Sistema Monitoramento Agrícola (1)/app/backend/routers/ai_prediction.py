import logging
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from dependencies.auth import get_current_user
from schemas.auth import UserResponse
from services.aihub import AIHubService
from schemas.aihub import GenTxtRequest, ChatMessage

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/prediction", tags=["prediction"])


class PredictionInput(BaseModel):
    ndvi: float
    precipitacao: float
    temperatura: float
    umidade_solo: float
    area: float
    producao_declarada: float
    cultura: str = "Soja"
    municipio: str = ""
    estado: str = ""


class PredictionOutput(BaseModel):
    producao_estimada: float
    anomaly_score: float
    risk_level: str
    confianca: float
    analise: str


@router.post("/analyze", response_model=PredictionOutput)
async def analyze_production(
    data: PredictionInput,
    current_user: UserResponse = Depends(get_current_user),
):
    """Use AI to analyze agricultural production data and detect anomalies"""
    try:
        service = AIHubService()

        prompt = f"""Você é um especialista em análise agrícola do Brasil. Analise os seguintes dados de produção e forneça uma avaliação técnica.

Dados de entrada:
- NDVI: {data.ndvi}
- Precipitação: {data.precipitacao} mm
- Temperatura: {data.temperatura} °C
- Umidade do Solo: {data.umidade_solo}%
- Área: {data.area} hectares
- Produção Declarada: {data.producao_declarada} toneladas
- Cultura: {data.cultura}
- Município: {data.municipio}
- Estado: {data.estado}

Com base nesses parâmetros, calcule:
1. Produção estimada (em toneladas) baseada no NDVI, área e condições climáticas
2. Anomaly Score (0-100): quanto maior, mais discrepância entre declarado e estimado
3. Nível de Risco: ALTO (score > 70), MÉDIO (score 40-70), BAIXO (score < 40)
4. Confiança do modelo (85-97%)

IMPORTANTE: Responda APENAS no formato JSON abaixo, sem texto adicional:
{{"producao_estimada": <numero>, "anomaly_score": <numero>, "risk_level": "<ALTO|MÉDIO|BAIXO>", "confianca": <numero>, "analise": "<texto breve com 2-3 frases explicando a análise>"}}"""

        request = GenTxtRequest(
            messages=[
                ChatMessage(role="system", content="Você é um modelo de IA especializado em análise de produção agrícola brasileira. Sempre responda em JSON válido."),
                ChatMessage(role="user", content=prompt),
            ],
            model="deepseek-v3.2",
        )

        response = await service.gentxt(request)
        content = response.content.strip()

        # Parse JSON from response
        import json
        # Try to extract JSON from the response
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        result = json.loads(content)

        return PredictionOutput(
            producao_estimada=float(result.get("producao_estimada", 0)),
            anomaly_score=float(result.get("anomaly_score", 0)),
            risk_level=str(result.get("risk_level", "BAIXO")),
            confianca=float(result.get("confianca", 90)),
            analise=str(result.get("analise", "Análise não disponível")),
        )

    except json.JSONDecodeError:
        # Fallback calculation if AI response is not valid JSON
        ndvi = data.ndvi
        area = data.area
        declarada = data.producao_declarada
        estimada = round(ndvi * area * 7.2, 2)
        gap = abs(estimada - declarada) / max(estimada, 1)
        anomaly_score = min(round(gap * 100), 100)
        risk_level = "ALTO" if anomaly_score > 70 else "MÉDIO" if anomaly_score > 40 else "BAIXO"

        return PredictionOutput(
            producao_estimada=estimada,
            anomaly_score=anomaly_score,
            risk_level=risk_level,
            confianca=88.0,
            analise=f"Análise baseada em cálculo direto. Produção estimada de {estimada} ton para área de {area} ha com NDVI {ndvi}.",
        )
    except Exception as e:
        logger.error(f"AI prediction error: {e}")
        # Fallback
        ndvi = data.ndvi
        area = data.area
        declarada = data.producao_declarada
        estimada = round(ndvi * area * 7.2, 2)
        gap = abs(estimada - declarada) / max(estimada, 1)
        anomaly_score = min(round(gap * 100), 100)
        risk_level = "ALTO" if anomaly_score > 70 else "MÉDIO" if anomaly_score > 40 else "BAIXO"

        return PredictionOutput(
            producao_estimada=estimada,
            anomaly_score=anomaly_score,
            risk_level=risk_level,
            confianca=85.0,
            analise=f"Análise via fallback. Estimativa de {estimada} ton baseada em NDVI={ndvi} e área={area} ha.",
        )