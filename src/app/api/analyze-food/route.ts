import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL da imagem é obrigatória' },
        { status: 400 }
      )
    }

    // Chamar OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analise esta imagem de alimento e retorne APENAS um objeto JSON válido (sem markdown, sem explicações) com a seguinte estrutura:
{
  "foodName": "nome do prato/alimento em português",
  "confidence": número de 0-100 indicando confiança na identificação,
  "portion": "descrição da porção (ex: '1 porção média (250g)')",
  "nutritionalInfo": {
    "calories": número de calorias,
    "protein": gramas de proteína,
    "carbs": gramas de carboidratos,
    "fat": gramas de gordura,
    "fiber": gramas de fibra,
    "sugar": gramas de açúcar,
    "sodium": miligramas de sódio,
    "calcium": miligramas de cálcio,
    "iron": miligramas de ferro,
    "vitaminC": miligramas de vitamina C,
    "vitaminA": microgramas de vitamina A,
    "potassium": miligramas de potássio
  }
}

Seja preciso nas estimativas nutricionais baseando-se em porções típicas. Se não conseguir identificar claramente, use confidence baixo (<50).`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      throw new Error('Resposta vazia da OpenAI')
    }

    // Tentar parsear o JSON (remover possíveis markdown)
    let cleanContent = content.trim()
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/g, '')
    }

    const analysis = JSON.parse(cleanContent)

    // Validar estrutura básica
    if (!analysis.foodName || !analysis.nutritionalInfo) {
      throw new Error('Estrutura de resposta inválida')
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Erro na análise de alimento:', error)
    
    return NextResponse.json(
      { 
        error: 'Erro ao analisar imagem',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
