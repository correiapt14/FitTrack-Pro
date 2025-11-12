'use client'

import { useState, useRef } from 'react'
import { Plus, Minus, Target, Utensils, Dumbbell, Timer, Play, Crown, Star, Zap, Camera, Upload, Loader2, X, Search, ChevronLeft, ChevronRight, Settings, Moon, Sun, TrendingUp, Waves, Bike, Footprints, Activity, Heart, Baby, Users, Accessibility, Trophy, MessageCircle, Send, Calendar, Bell, Globe, Volume2, VolumeX, Pill } from 'lucide-react'

interface NutritionalInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  calcium: number
  iron: number
  vitaminC: number
  vitaminA: number
  potassium: number
}

interface FoodAnalysis {
  foodName: string
  confidence: number
  nutritionalInfo: NutritionalInfo
  portion: string
}

interface Recipe {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  image: string
  cuisine: string
}

interface CustomRecipe extends Recipe {
  id: string
  createdAt: Date
  ingredients: Array<{
    name: string
    quantity: number
    unit: string
  }>
}

interface OnboardingAnswers {
  age: number
  gender: string
  dailyGoal: number
  currentlyExercising: boolean
  exerciseFrequency: string
  hasGymMembership: boolean
  sportsActivity: string
  smoker: string
  drugUser: string
  healthConditions: string[]
  fitnessGoal: string
  experienceLevel: string
  availableEquipment: string[]
  dietaryRestrictions: string[]
  trainingDays: string[]
  trainingDaysPerWeek: number
  wakeUpTime: string
  breakfastTime: string
  morningSnackTime: string
  lunchTime: string
  afternoonSnackTime: string
  dinnerTime: string
  supperTime: string
  supplementationGoal: string
  supplementationExperience: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface WeeklyWorkout {
  week: number
  day: string
  muscleGroup: string
  exercises: Array<{
    name: string
    sets: string
    reps: string
    rest: string
    videoUrl: string
    gymVersion: boolean
    homeVersion: boolean
  }>
}

export default function FitTrackProApp() {
  const [activeTab, setActiveTab] = useState('counter')
  const [selectedPlan, setSelectedPlan] = useState('basic')
  const [dailyCalories, setDailyCalories] = useState(1800)
  const [consumedCalories, setConsumedCalories] = useState(650)
  const [consumedNutrients, setConsumedNutrients] = useState<NutritionalInfo>({
    calories: 650,
    protein: 45,
    carbs: 78,
    fat: 22,
    fiber: 12,
    sugar: 18,
    sodium: 890,
    calcium: 320,
    iron: 8.5,
    vitaminC: 85,
    vitaminA: 420,
    potassium: 1250
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(null)
  const [showAnalysisModal, setShowAnalysisModal] = useState(false)
  const [showMetricsModal, setShowMetricsModal] = useState(false)
  const [showMealSearchModal, setShowMealSearchModal] = useState(false)
  const [showCreateRecipeModal, setShowCreateRecipeModal] = useState(false)
  const [showOnboardingModal, setShowOnboardingModal] = useState(true)
  const [showChatbotModal, setShowChatbotModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [onboardingAnswers, setOnboardingAnswers] = useState<Partial<OnboardingAnswers>>({})
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('pt')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedActivity, setSelectedActivity] = useState('corrida')
  const [selectedSportCategory, setSelectedSportCategory] = useState('voleibol')
  const [currentWeek, setCurrentWeek] = useState(1)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Olá! Sou seu assistente de treinos. Como posso ajudar? Posso sugerir alterações no seu plano, substituir exercícios ou responder dúvidas sobre treinos.' }
  ])
  const [chatInput, setChatInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dados de refeições mundiais
  const worldMeals: Recipe[] = [
    { name: 'Sushi Salmão (8 peças)', calories: 350, protein: 28, carbs: 42, fat: 8, fiber: 2, sugar: 6, sodium: 680, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop', cuisine: 'Japonesa' },
    { name: 'Pad Thai', calories: 450, protein: 18, carbs: 58, fat: 16, fiber: 4, sugar: 12, sodium: 920, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=300&h=200&fit=crop', cuisine: 'Tailandesa' },
    { name: 'Burrito Bowl', calories: 520, protein: 32, carbs: 62, fat: 18, fiber: 12, sugar: 8, sodium: 1100, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&h=200&fit=crop', cuisine: 'Mexicana' },
    { name: 'Poke Bowl', calories: 420, protein: 35, carbs: 48, fat: 12, fiber: 6, sugar: 10, sodium: 780, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop', cuisine: 'Havaiana' },
    { name: 'Falafel Wrap', calories: 380, protein: 14, carbs: 52, fat: 14, fiber: 8, sugar: 6, sodium: 650, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300&h=200&fit=crop', cuisine: 'Mediterrânea' },
    { name: 'Chicken Tikka Masala', calories: 480, protein: 38, carbs: 35, fat: 22, fiber: 5, sugar: 9, sodium: 980, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop', cuisine: 'Indiana' },
    { name: 'Açaí Bowl', calories: 320, protein: 8, carbs: 58, fat: 12, fiber: 10, sugar: 32, sodium: 45, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&h=200&fit=crop', cuisine: 'Brasileira' },
    { name: 'Greek Salad', calories: 280, protein: 12, carbs: 18, fat: 18, fiber: 6, sugar: 8, sodium: 720, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop', cuisine: 'Grega' },
  ]

  const [customRecipes, setCustomRecipes] = useState<CustomRecipe[]>([])

  const activities = [
    { id: 'corrida', name: 'Corrida', icon: Footprints },
    { id: 'ciclismo', name: 'Ciclismo', icon: Bike },
    { id: 'natacao', name: 'Natação', icon: Waves },
    { id: 'triatlo', name: 'Triatlo', icon: Activity },
    { id: 'caminhada', name: 'Caminhada', icon: TrendingUp },
  ]

  const sportCategories = [
    { id: 'voleibol', name: 'Voleibol', icon: Activity },
    { id: 'tenis', name: 'Ténis', icon: Activity },
    { id: 'artes-marciais', name: 'Artes Marciais', icon: Target },
  ]

  const roadToPlans: Record<string, Array<{ name: string; duration: string; level: string }>> = {
    corrida: [
      { name: 'Road to 5K', duration: '8 semanas', level: 'Iniciante' },
      { name: 'Road to 10K', duration: '10 semanas', level: 'Intermediário' },
      { name: 'Road to Half-Marathon', duration: '12 semanas', level: 'Intermediário' },
      { name: 'Road to Marathon', duration: '16 semanas', level: 'Avançado' },
      { name: 'Road to Ultra Marathon', duration: '20 semanas', level: 'Elite' },
    ],
    ciclismo: [
      { name: 'Road to 50K', duration: '6 semanas', level: 'Iniciante' },
      { name: 'Road to 100K', duration: '10 semanas', level: 'Intermediário' },
      { name: 'Road to Century Ride', duration: '12 semanas', level: 'Avançado' },
      { name: 'Road to Gran Fondo', duration: '14 semanas', level: 'Avançado' },
    ],
    natacao: [
      { name: 'Road to 1K Open Water', duration: '8 semanas', level: 'Iniciante' },
      { name: 'Road to 5K Open Water', duration: '12 semanas', level: 'Intermediário' },
      { name: 'Road to 10K Open Water', duration: '16 semanas', level: 'Avançado' },
    ],
    triatlo: [
      { name: 'Road to Sprint Triathlon', duration: '10 semanas', level: 'Iniciante' },
      { name: 'Road to Olympic Triathlon', duration: '14 semanas', level: 'Intermediário' },
      { name: 'Road to Ironman 70.3', duration: '20 semanas', level: 'Avançado' },
      { name: 'Road to Ironman', duration: '24 semanas', level: 'Elite' },
    ],
    caminhada: [
      { name: 'Road to 5K Walk', duration: '6 semanas', level: 'Iniciante' },
      { name: 'Road to 10K Walk', duration: '8 semanas', level: 'Iniciante' },
      { name: 'Road to Half-Marathon Walk', duration: '12 semanas', level: 'Intermediário' },
    ],
  }

  const sportPlans: Record<string, Array<{ name: string; duration: string; focus: string }>> = {
    voleibol: [
      { name: 'Potência de Ataque', duration: '10 semanas', focus: 'Ombros + Salto' },
      { name: 'Agilidade e Reflexos', duration: '8 semanas', focus: 'Coordenação + Velocidade' },
    ],
    tenis: [
      { name: 'Resistência para Ténis', duration: '12 semanas', focus: 'Cardio + Força' },
      { name: 'Explosão Lateral', duration: '8 semanas', focus: 'Agilidade + Core' },
    ],
    'artes-marciais': [
      { name: 'Força para Combate', duration: '10 semanas', focus: 'Funcional + Técnica' },
      { name: 'Resistência de Luta', duration: '12 semanas', focus: 'Cardio + Força' },
    ],
  }

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '€4.99',
      period: '/mês',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Contagem de calorias diária',
        'Análise nutricional por fotografia',
        'Planos de dieta nutricional',
        'Receitas fitness com calorias',
        'Tabela nutricional completa',
        'Histórico de 30 dias'
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced',
      price: '€14.99',
      period: '/mês',
      icon: Dumbbell,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        'Tudo do plano Basic',
        'Análise avançada de micronutrientes',
        'Planos de treino personalizados',
        '100+ exercícios para ginásio e casa',
        'Treinos para grávidas',
        'Treinos para mobilidade reduzida',
        'Treinos para idosos',
        'Vídeos de todos os exercícios',
        'Sugestões de cargas personalizadas',
        'Acompanhamento de progresso',
        'Suporte prioritário'
      ]
    },
    {
      id: 'athlete',
      name: 'Athlete',
      price: '€29.99',
      period: '/mês',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      features: [
        'Tudo dos planos anteriores',
        'Planos Road to para todas atividades',
        'Preparação para provas desportivas',
        'Treinos específicos para desportos',
        'Voleibol, Ténis, Artes Marciais',
        'Planos ginásio + modalidade',
        'Treinos de natação, triatlo, ciclismo',
        'Planos de suplementação personalizados',
        'Notificações de treino e suplementação',
        'Análise de performance',
        'Coach virtual personalizado 24/7'
      ]
    }
  ]

  const recipes = [
    {
      name: 'Frango Grelhado com Quinoa',
      calories: 420,
      protein: 35,
      carbs: 28,
      fat: 12,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop'
    },
    {
      name: 'Salada de Atum Fitness',
      calories: 280,
      protein: 25,
      carbs: 15,
      fat: 8,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop'
    },
    {
      name: 'Smoothie Proteico',
      calories: 320,
      protein: 28,
      carbs: 35,
      fat: 6,
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=200&fit=crop'
    }
  ]

  const specializedWorkouts = [
    {
      category: 'Grávidas',
      icon: Baby,
      condition: 'Gravidez',
      workouts: [
        { name: '1º Trimestre - Suave', duration: '25 min', exercises: 8, level: 'Leve' },
        { name: '2º Trimestre - Moderado', duration: '30 min', exercises: 10, level: 'Moderado' },
        { name: '3º Trimestre - Preparação', duration: '20 min', exercises: 6, level: 'Leve' },
        { name: 'Pós-Parto Recuperação', duration: '15 min', exercises: 5, level: 'Muito Leve' },
      ]
    },
    {
      category: 'Mobilidade Reduzida',
      icon: Accessibility,
      condition: 'Mobilidade reduzida',
      workouts: [
        { name: 'Treino Sentado - Superior', duration: '30 min', exercises: 12, level: 'Adaptado' },
        { name: 'Treino Sentado - Core', duration: '20 min', exercises: 8, level: 'Adaptado' },
        { name: 'Mobilidade Articular', duration: '25 min', exercises: 10, level: 'Suave' },
        { name: 'Força com Elásticos', duration: '35 min', exercises: 14, level: 'Adaptado' },
      ]
    },
    {
      category: 'Idosos',
      icon: Heart,
      condition: 'Idoso',
      workouts: [
        { name: 'Equilíbrio e Coordenação', duration: '20 min', exercises: 8, level: 'Suave' },
        { name: 'Força Funcional Sénior', duration: '25 min', exercises: 10, level: 'Leve' },
        { name: 'Flexibilidade e Mobilidade', duration: '30 min', exercises: 12, level: 'Suave' },
        { name: 'Caminhada Ativa', duration: '15 min', exercises: 5, level: 'Leve' },
      ]
    },
    {
      category: 'Impossibilidades Físicas',
      icon: Users,
      condition: 'Lesões recentes',
      workouts: [
        { name: 'Sem Joelhos - Inferior', duration: '30 min', exercises: 10, level: 'Adaptado' },
        { name: 'Sem Ombros - Superior', duration: '25 min', exercises: 8, level: 'Adaptado' },
        { name: 'Sem Coluna - Core Seguro', duration: '20 min', exercises: 7, level: 'Adaptado' },
        { name: 'Cardio Baixo Impacto', duration: '35 min', exercises: 12, level: 'Moderado' },
      ]
    }
  ]

  // Treinos rotativos por semana e dia com vídeos
  const weeklyWorkoutsByDay: Record<string, WeeklyWorkout[]> = {
    'Segunda-feira': [
      {
        week: 1,
        day: 'Segunda-feira',
        muscleGroup: 'Peito e Tríceps',
        exercises: [
          { name: 'Supino Reto', sets: '4', reps: '8-10', rest: '90s', videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg', gymVersion: true, homeVersion: false },
          { name: 'Supino Inclinado', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=SrqOu55lrYU', gymVersion: true, homeVersion: false },
          { name: 'Flexões', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4', gymVersion: true, homeVersion: true },
          { name: 'Crucifixo', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0', gymVersion: true, homeVersion: false },
          { name: 'Tríceps Testa', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM', gymVersion: true, homeVersion: true },
          { name: 'Tríceps Corda', sets: '3', reps: '12-15', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME', gymVersion: true, homeVersion: false },
        ]
      },
      {
        week: 2,
        day: 'Segunda-feira',
        muscleGroup: 'Peito e Tríceps',
        exercises: [
          { name: 'Supino Inclinado com Halteres', sets: '4', reps: '8-10', rest: '90s', videoUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8', gymVersion: true, homeVersion: true },
          { name: 'Flexões com Peso', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4', gymVersion: true, homeVersion: true },
          { name: 'Crossover', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=taI4XduLpTk', gymVersion: true, homeVersion: false },
          { name: 'Tríceps Francês', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=nRiJVZDpdL0', gymVersion: true, homeVersion: true },
          { name: 'Mergulho em Paralelas', sets: '3', reps: '8-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As', gymVersion: true, homeVersion: true },
          { name: 'Flexões Diamante', sets: '3', reps: '10-15', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I', gymVersion: true, homeVersion: true },
        ]
      }
    ],
    'Terça-feira': [
      {
        week: 1,
        day: 'Terça-feira',
        muscleGroup: 'Costas e Bíceps',
        exercises: [
          { name: 'Barra Fixa', sets: '4', reps: '6-10', rest: '90s', videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g', gymVersion: true, homeVersion: true },
          { name: 'Remada Curvada', sets: '4', reps: '8-10', rest: '90s', videoUrl: 'https://www.youtube.com/watch?v=kBWAon7ItDw', gymVersion: true, homeVersion: true },
          { name: 'Puxada Frontal', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc', gymVersion: true, homeVersion: false },
          { name: 'Remada Unilateral', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=roCP6wCXPqo', gymVersion: true, homeVersion: true },
          { name: 'Rosca Direta', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=LY1V6UbRHFM', gymVersion: true, homeVersion: true },
          { name: 'Rosca Martelo', sets: '3', reps: '12-15', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4', gymVersion: true, homeVersion: true },
        ]
      },
      {
        week: 2,
        day: 'Terça-feira',
        muscleGroup: 'Costas e Bíceps',
        exercises: [
          { name: 'Levantamento Terra', sets: '4', reps: '6-8', rest: '120s', videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q', gymVersion: true, homeVersion: true },
          { name: 'Remada Unilateral', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=roCP6wCXPqo', gymVersion: true, homeVersion: true },
          { name: 'Pulldown Pegada Fechada', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc', gymVersion: true, homeVersion: false },
          { name: 'Remada Invertida', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=hXTc1mDnZCw', gymVersion: true, homeVersion: true },
          { name: 'Rosca Alternada', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=sAq_ocpRh_I', gymVersion: true, homeVersion: true },
          { name: 'Rosca Scott', sets: '3', reps: '12-15', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=m5RwEQMvyKI', gymVersion: true, homeVersion: false },
        ]
      }
    ],
    'Quarta-feira': [
      {
        week: 1,
        day: 'Quarta-feira',
        muscleGroup: 'Pernas Completo',
        exercises: [
          { name: 'Agachamento Livre', sets: '4', reps: '8-10', rest: '120s', videoUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8', gymVersion: true, homeVersion: true },
          { name: 'Leg Press', sets: '4', reps: '10-12', rest: '90s', videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ', gymVersion: true, homeVersion: false },
          { name: 'Cadeira Extensora', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0', gymVersion: true, homeVersion: false },
          { name: 'Cadeira Flexora', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=ELOCsoDSmrg', gymVersion: true, homeVersion: false },
          { name: 'Afundo', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U', gymVersion: true, homeVersion: true },
          { name: 'Panturrilha em Pé', sets: '4', reps: '15-20', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=gwLzBJYoWlI', gymVersion: true, homeVersion: true },
        ]
      },
      {
        week: 2,
        day: 'Quarta-feira',
        muscleGroup: 'Pernas Completo',
        exercises: [
          { name: 'Agachamento Frontal', sets: '4', reps: '8-10', rest: '120s', videoUrl: 'https://www.youtube.com/watch?v=uYumuL_G_V0', gymVersion: true, homeVersion: true },
          { name: 'Afundo com Halteres', sets: '3', reps: '10-12', rest: '90s', videoUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE', gymVersion: true, homeVersion: true },
          { name: 'Stiff', sets: '3', reps: '10-12', rest: '90s', videoUrl: 'https://www.youtube.com/watch?v=1uDiW5--rAE', gymVersion: true, homeVersion: true },
          { name: 'Agachamento Búlgaro', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE', gymVersion: true, homeVersion: true },
          { name: 'Cadeira Abdutora', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=3XDriUn0udo', gymVersion: true, homeVersion: false },
          { name: 'Panturrilha Sentado', sets: '4', reps: '15-20', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=JbyjNymZOt0', gymVersion: true, homeVersion: true },
        ]
      }
    ],
    'Quinta-feira': [
      {
        week: 1,
        day: 'Quinta-feira',
        muscleGroup: 'Ombros e Trapézio',
        exercises: [
          { name: 'Desenvolvimento com Barra', sets: '4', reps: '8-10', rest: '90s', videoUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI', gymVersion: true, homeVersion: false },
          { name: 'Desenvolvimento com Halteres', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog', gymVersion: true, homeVersion: true },
          { name: 'Elevação Lateral', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo', gymVersion: true, homeVersion: true },
          { name: 'Elevação Frontal', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=qsl6Txcvw-0', gymVersion: true, homeVersion: true },
          { name: 'Remada Alta', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=XP8S9LXbVqI', gymVersion: true, homeVersion: true },
          { name: 'Encolhimento', sets: '4', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=cJRVVxmytaM', gymVersion: true, homeVersion: true },
        ]
      },
      {
        week: 2,
        day: 'Quinta-feira',
        muscleGroup: 'Ombros e Trapézio',
        exercises: [
          { name: 'Desenvolvimento com Halteres', sets: '4', reps: '8-10', rest: '90s', videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog', gymVersion: true, homeVersion: true },
          { name: 'Elevação Lateral Inclinado', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo', gymVersion: true, homeVersion: true },
          { name: 'Crucifixo Inverso', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=T7gWBKwzUKY', gymVersion: true, homeVersion: true },
          { name: 'Desenvolvimento Arnold', sets: '3', reps: '10-12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=6Z15_WdXmVw', gymVersion: true, homeVersion: true },
          { name: 'Face Pull', sets: '3', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk', gymVersion: true, homeVersion: false },
          { name: 'Encolhimento com Halteres', sets: '4', reps: '12-15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=cJRVVxmytaM', gymVersion: true, homeVersion: true },
        ]
      }
    ],
    'Sexta-feira': [
      {
        week: 1,
        day: 'Sexta-feira',
        muscleGroup: 'Core e Abdominais',
        exercises: [
          { name: 'Prancha', sets: '3', reps: '60s', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c', gymVersion: true, homeVersion: true },
          { name: 'Abdominal Supra', sets: '4', reps: '15-20', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU', gymVersion: true, homeVersion: true },
          { name: 'Abdominal Infra', sets: '4', reps: '15-20', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI', gymVersion: true, homeVersion: true },
          { name: 'Prancha Lateral', sets: '3', reps: '45s', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=K2VljzCC16g', gymVersion: true, homeVersion: true },
          { name: 'Russian Twist', sets: '3', reps: '20', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI', gymVersion: true, homeVersion: true },
          { name: 'Mountain Climbers', sets: '3', reps: '30s', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM', gymVersion: true, homeVersion: true },
        ]
      },
      {
        week: 2,
        day: 'Sexta-feira',
        muscleGroup: 'Core e Abdominais',
        exercises: [
          { name: 'Prancha com Elevação', sets: '3', reps: '45s', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c', gymVersion: true, homeVersion: true },
          { name: 'Abdominal Bicicleta', sets: '4', reps: '20', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8', gymVersion: true, homeVersion: true },
          { name: 'Elevação de Pernas', sets: '4', reps: '12-15', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI', gymVersion: true, homeVersion: true },
          { name: 'Mountain Climbers', sets: '3', reps: '30s', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM', gymVersion: true, homeVersion: true },
          { name: 'Dead Bug', sets: '3', reps: '15', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=4XLEnwUr1d8', gymVersion: true, homeVersion: true },
          { name: 'Hollow Hold', sets: '3', reps: '30s', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=LlDNef_Ztsc', gymVersion: true, homeVersion: true },
        ]
      }
    ],
    'Sábado': [
      {
        week: 1,
        day: 'Sábado',
        muscleGroup: 'Full Body',
        exercises: [
          { name: 'Agachamento', sets: '3', reps: '12', rest: '90s', videoUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8', gymVersion: true, homeVersion: true },
          { name: 'Supino', sets: '3', reps: '12', rest: '90s', videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg', gymVersion: true, homeVersion: false },
          { name: 'Remada', sets: '3', reps: '12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=kBWAon7ItDw', gymVersion: true, homeVersion: true },
          { name: 'Desenvolvimento', sets: '3', reps: '12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog', gymVersion: true, homeVersion: true },
          { name: 'Prancha', sets: '3', reps: '45s', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c', gymVersion: true, homeVersion: true },
          { name: 'Burpees', sets: '3', reps: '10', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU', gymVersion: true, homeVersion: true },
        ]
      },
      {
        week: 2,
        day: 'Sábado',
        muscleGroup: 'Full Body',
        exercises: [
          { name: 'Levantamento Terra', sets: '3', reps: '10', rest: '120s', videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q', gymVersion: true, homeVersion: true },
          { name: 'Flexões', sets: '3', reps: '15', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4', gymVersion: true, homeVersion: true },
          { name: 'Barra Fixa', sets: '3', reps: '8-10', rest: '90s', videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g', gymVersion: true, homeVersion: true },
          { name: 'Afundo', sets: '3', reps: '12', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U', gymVersion: true, homeVersion: true },
          { name: 'Burpees', sets: '3', reps: '10', rest: '60s', videoUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU', gymVersion: true, homeVersion: true },
          { name: 'Russian Twist', sets: '3', reps: '20', rest: '45s', videoUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI', gymVersion: true, homeVersion: true },
        ]
      }
    ],
    'Domingo': [
      {
        week: 1,
        day: 'Domingo',
        muscleGroup: 'Cardio e Mobilidade',
        exercises: [
          { name: 'Corrida Leve', sets: '1', reps: '30 min', rest: '-', videoUrl: 'https://www.youtube.com/watch?v=brFHyOtTwH4', gymVersion: true, homeVersion: true },
          { name: 'Alongamento Completo', sets: '1', reps: '15 min', rest: '-', videoUrl: 'https://www.youtube.com/watch?v=g_tea8ZNk5A', gymVersion: true, homeVersion: true },
          { name: 'Yoga Flow', sets: '1', reps: '20 min', rest: '-', videoUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE', gymVersion: true, homeVersion: true },
        ]
      },
      {
        week: 2,
        day: 'Domingo',
        muscleGroup: 'Cardio e Mobilidade',
        exercises: [
          { name: 'Ciclismo', sets: '1', reps: '40 min', rest: '-', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', gymVersion: true, homeVersion: true },
          { name: 'Foam Rolling', sets: '1', reps: '10 min', rest: '-', videoUrl: 'https://www.youtube.com/watch?v=_wvGBVmWJlQ', gymVersion: true, homeVersion: true },
          { name: 'Stretching Dinâmico', sets: '1', reps: '15 min', rest: '-', videoUrl: 'https://www.youtube.com/watch?v=g_tea8ZNk5A', gymVersion: true, homeVersion: true },
        ]
      }
    ]
  }

  const supplementationPlans = {
    'Ganho de Massa': [
      { name: 'Whey Protein', dosage: '30g', timing: 'Pós-treino', description: 'Proteína de rápida absorção' },
      { name: 'Creatina', dosage: '5g', timing: 'Pós-treino', description: 'Aumenta força e volume muscular' },
      { name: 'BCAA', dosage: '5g', timing: 'Pré-treino', description: 'Reduz catabolismo muscular' },
      { name: 'Multivitamínico', dosage: '1 cápsula', timing: 'Café da manhã', description: 'Suporte nutricional completo' },
    ],
    'Perda de Peso': [
      { name: 'Whey Protein', dosage: '25g', timing: 'Entre refeições', description: 'Mantém saciedade' },
      { name: 'Termogênico', dosage: '1 cápsula', timing: 'Pré-treino', description: 'Acelera metabolismo' },
      { name: 'Ômega 3', dosage: '2g', timing: 'Almoço', description: 'Anti-inflamatório natural' },
      { name: 'Multivitamínico', dosage: '1 cápsula', timing: 'Café da manhã', description: 'Suporte em déficit calórico' },
    ],
    'Performance': [
      { name: 'Pré-treino', dosage: '1 dose', timing: '30min antes', description: 'Energia e foco' },
      { name: 'Whey Protein', dosage: '30g', timing: 'Pós-treino', description: 'Recuperação muscular' },
      { name: 'Creatina', dosage: '5g', timing: 'Pós-treino', description: 'Força e potência' },
      { name: 'Beta-Alanina', dosage: '3g', timing: 'Pré-treino', description: 'Reduz fadiga muscular' },
      { name: 'Glutamina', dosage: '5g', timing: 'Pós-treino', description: 'Recuperação e imunidade' },
    ],
  }

  const onboardingQuestions = [
    {
      step: 0,
      title: 'Bem-vindo ao FitTrack Pro! 🎯',
      subtitle: 'Vamos conhecer você melhor para criar o plano perfeito',
      fields: [
        { type: 'number', name: 'age', label: 'Qual a sua idade?', placeholder: '25' },
        { type: 'select', name: 'gender', label: 'Género', options: ['Masculino', 'Feminino', 'Outro'] },
      ]
    },
    {
      step: 1,
      title: 'Objetivos e Atividade Física 💪',
      subtitle: 'Conte-nos sobre sua rotina atual',
      fields: [
        { type: 'select', name: 'fitnessGoal', label: 'Qual o seu objetivo principal?', options: ['Perder peso', 'Ganhar massa muscular', 'Manter forma', 'Melhorar performance', 'Saúde geral'] },
        { type: 'select', name: 'currentlyExercising', label: 'Já pratica exercício físico?', options: ['Sim, regularmente', 'Sim, ocasionalmente', 'Não, mas quero começar'] },
      ]
    },
    {
      step: 2,
      title: 'Frequência de Treino 📅',
      subtitle: 'Quantos dias por semana você quer treinar?',
      fields: [
        { type: 'multiselect', name: 'trainingDays', label: 'Selecione os dias que deseja treinar', options: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'] },
        { type: 'select', name: 'trainingDaysPerWeek', label: 'Ou escolha quantidade de dias', options: ['1 dia', '2 dias', '3 dias', '4 dias', '5 dias', '6 dias', '7 dias'] },
      ]
    },
    {
      step: 3,
      title: 'Experiência e Equipamento 🏋️',
      subtitle: 'Ajude-nos a personalizar seus treinos',
      fields: [
        { type: 'select', name: 'experienceLevel', label: 'Nível de experiência', options: ['Iniciante', 'Intermediário', 'Avançado', 'Atleta'] },
        { type: 'select', name: 'hasGymMembership', label: 'Tem acesso a ginásio?', options: ['Sim', 'Não'] },
        { type: 'multiselect', name: 'availableEquipment', label: 'Equipamento disponível', options: ['Halteres', 'Barras', 'Elásticos', 'Kettlebells', 'Máquinas', 'Nenhum'] },
      ]
    },
    {
      step: 4,
      title: 'Desportos e Atividades ⚽',
      subtitle: 'Pratica alguma modalidade desportiva?',
      fields: [
        { type: 'select', name: 'sportsActivity', label: 'Modalidade principal', options: ['Nenhuma', 'Corrida', 'Ciclismo', 'Natação', 'Ténis', 'Artes Marciais', 'Outro'] },
      ]
    },
    {
      step: 5,
      title: 'Saúde e Estilo de Vida 🏥',
      subtitle: 'Informações importantes para sua segurança',
      fields: [
        { type: 'select', name: 'smoker', label: 'É fumador?', options: ['Não', 'Sim, ocasionalmente', 'Sim, regularmente'] },
        { type: 'select', name: 'drugUser', label: 'Usa substâncias recreativas?', options: ['Não', 'Ocasionalmente', 'Regularmente'] },
        { type: 'multiselect', name: 'healthConditions', label: 'Condições de saúde', options: ['Nenhuma', 'Problemas cardíacos', 'Problemas articulares', 'Diabetes', 'Hipertensão', 'Lesões recentes', 'Gravidez', 'Mobilidade reduzida', 'Idoso'] },
      ]
    },
    {
      step: 6,
      title: 'Horários da Sua Rotina ⏰',
      subtitle: 'Configure notificações para suas refeições e treinos',
      fields: [
        { type: 'time', name: 'wakeUpTime', label: 'Hora de acordar', placeholder: '07:00' },
        { type: 'time', name: 'breakfastTime', label: 'Hora do café da manhã', placeholder: '08:00' },
        { type: 'time', name: 'morningSnackTime', label: 'Hora do lanche da manhã', placeholder: '10:30' },
        { type: 'time', name: 'lunchTime', label: 'Hora do almoço', placeholder: '13:00' },
        { type: 'time', name: 'afternoonSnackTime', label: 'Hora do lanche da tarde', placeholder: '16:00' },
        { type: 'time', name: 'dinnerTime', label: 'Hora do jantar', placeholder: '19:30' },
        { type: 'time', name: 'supperTime', label: 'Hora da ceia (opcional)', placeholder: '22:00' },
      ]
    },
    {
      step: 7,
      title: 'Suplementação 💊',
      subtitle: 'Personalize seu plano de suplementos (Plano Athlete)',
      fields: [
        { type: 'select', name: 'supplementationGoal', label: 'Objetivo com suplementação', options: ['Ganho de Massa', 'Perda de Peso', 'Performance', 'Não quero suplementação'] },
        { type: 'select', name: 'supplementationExperience', label: 'Experiência com suplementos', options: ['Nunca usei', 'Uso ocasionalmente', 'Uso regularmente'] },
      ]
    },
    {
      step: 8,
      title: 'Meta Diária de Calorias 🎯',
      subtitle: 'Baseado nas suas respostas, recomendamos:',
      fields: [
        { type: 'number', name: 'dailyGoal', label: 'Meta diária de calorias', placeholder: '2000', recommended: true },
      ]
    }
  ]

  const addCalories = (amount: number) => {
    setConsumedCalories(prev => Math.max(0, prev + amount))
  }

  const addMealWithNutrients = (meal: Recipe) => {
    setConsumedCalories(prev => prev + meal.calories)
    setConsumedNutrients(prev => ({
      calories: prev.calories + meal.calories,
      protein: prev.protein + meal.protein,
      carbs: prev.carbs + meal.carbs,
      fat: prev.fat + meal.fat,
      fiber: prev.fiber + meal.fiber,
      sugar: prev.sugar + meal.sugar,
      sodium: prev.sodium + meal.sodium,
      calcium: prev.calcium + (meal.calories * 0.5),
      iron: prev.iron + (meal.protein * 0.1),
      vitaminC: prev.vitaminC + (meal.calories * 0.15),
      vitaminA: prev.vitaminA + (meal.calories * 0.8),
      potassium: prev.potassium + (meal.calories * 2)
    }))
    setShowMealSearchModal(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setCapturedImage(imageUrl)
        analyzeFood(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeFood = async (imageUrl: string) => {
    setIsAnalyzing(true)
    setShowAnalysisModal(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockAnalysis: FoodAnalysis = {
        foodName: "Prato de Salmão Grelhado com Vegetais",
        confidence: 92,
        portion: "1 porção média (250g)",
        nutritionalInfo: {
          calories: 385,
          protein: 32.5,
          carbs: 18.2,
          fat: 22.1,
          fiber: 4.8,
          sugar: 8.3,
          sodium: 420,
          calcium: 85,
          iron: 2.1,
          vitaminC: 45,
          vitaminA: 180,
          potassium: 650
        }
      }
      
      setAnalysisResult(mockAnalysis)
    } catch (error) {
      console.error('Erro na análise:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const addAnalyzedFood = () => {
    if (analysisResult) {
      const nutrients = analysisResult.nutritionalInfo
      setConsumedCalories(prev => prev + nutrients.calories)
      setConsumedNutrients(prev => ({
        calories: prev.calories + nutrients.calories,
        protein: prev.protein + nutrients.protein,
        carbs: prev.carbs + nutrients.carbs,
        fat: prev.fat + nutrients.fat,
        fiber: prev.fiber + nutrients.fiber,
        sugar: prev.sugar + nutrients.sugar,
        sodium: prev.sodium + nutrients.sodium,
        calcium: prev.calcium + nutrients.calcium,
        iron: prev.iron + nutrients.iron,
        vitaminC: prev.vitaminC + nutrients.vitaminC,
        vitaminA: prev.vitaminA + nutrients.vitaminA,
        potassium: prev.potassium + nutrients.potassium
      }))
      setShowAnalysisModal(false)
      setAnalysisResult(null)
      setCapturedImage(null)
    }
  }

  const closeAnalysisModal = () => {
    setShowAnalysisModal(false)
    setAnalysisResult(null)
    setCapturedImage(null)
    setIsAnalyzing(false)
  }

  const calculateRecommendedCalories = () => {
    const age = onboardingAnswers.age || 25
    const isMale = onboardingAnswers.gender === 'Masculino'
    const baseCalories = isMale ? 2200 : 1800
    
    let adjustment = 0
    if (onboardingAnswers.fitnessGoal === 'Perder peso') adjustment = -300
    if (onboardingAnswers.fitnessGoal === 'Ganhar massa muscular') adjustment = +400
    if (onboardingAnswers.trainingDaysPerWeek && parseInt(onboardingAnswers.trainingDaysPerWeek) >= 5) adjustment += 200
    
    return baseCalories + adjustment
  }

  const completeOnboarding = () => {
    const recommendedCalories = calculateRecommendedCalories()
    setDailyCalories(onboardingAnswers.dailyGoal || recommendedCalories)
    setShowOnboardingModal(false)
    
    // Simular configuração de notificações
    if (notificationsEnabled) {
      console.log('Notificações configuradas para:', {
        refeições: {
          breakfast: onboardingAnswers.breakfastTime,
          morningSnack: onboardingAnswers.morningSnackTime,
          lunch: onboardingAnswers.lunchTime,
          afternoonSnack: onboardingAnswers.afternoonSnackTime,
          dinner: onboardingAnswers.dinnerTime,
          supper: onboardingAnswers.supperTime,
        },
        treino: {
          dias: onboardingAnswers.trainingDays,
          horário: onboardingAnswers.wakeUpTime
        }
      })
    }
  }

  const filteredMeals = worldMeals.filter(meal => 
    meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meal.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sendChatMessage = () => {
    if (!chatInput.trim()) return

    const newMessages: ChatMessage[] = [
      ...chatMessages,
      { role: 'user', content: chatInput }
    ]

    // Simular resposta do assistente
    setTimeout(() => {
      let response = ''
      const input = chatInput.toLowerCase()

      if (input.includes('ombro') || input.includes('ombros')) {
        response = 'Entendo! Posso ajustar seu plano removendo exercícios de ombros. Vou substituir por exercícios alternativos focados em outras áreas. Gostaria de focar mais em peito, costas ou pernas?'
      } else if (input.includes('joelho') || input.includes('joelhos')) {
        response = 'Sem problemas! Vou adaptar seu treino com exercícios de baixo impacto para os joelhos. Posso incluir mais exercícios na cadeira extensora, leg press com amplitude reduzida e trabalho de core.'
      } else if (input.includes('mudar') || input.includes('alterar')) {
        response = 'Claro! Posso personalizar seu plano. Me diga qual exercício você quer substituir e por qual motivo (dor, desconforto, falta de equipamento) que eu sugiro alternativas.'
      } else if (input.includes('semana')) {
        response = 'Seu plano muda automaticamente toda semana! Na Semana 1 você tem um conjunto de exercícios, na Semana 2 outros exercícios para os mesmos grupos musculares. Isso evita adaptação e maximiza resultados.'
      } else if (input.includes('video') || input.includes('vídeo')) {
        response = 'Todos os exercícios têm vídeos de demonstração! Clique no exercício para ver a técnica correta de execução. Os vídeos mostram tanto a versão para ginásio quanto para casa.'
      } else {
        response = 'Estou aqui para ajudar! Posso: 1) Substituir exercícios que causam desconforto, 2) Ajustar cargas e repetições, 3) Explicar técnicas de execução, 4) Sugerir alternativas para equipamentos. O que você precisa?'
      }

      setChatMessages([...newMessages, { role: 'assistant', content: response }])
    }, 1000)

    setChatMessages(newMessages)
    setChatInput('')
  }

  // Verificar se deve mostrar planos especializados
  const shouldShowSpecializedWorkouts = () => {
    const conditions = onboardingAnswers.healthConditions || []
    return conditions.some(condition => 
      ['Gravidez', 'Mobilidade reduzida', 'Idoso', 'Lesões recentes'].includes(condition)
    )
  }

  const getVisibleSpecializedWorkouts = () => {
    const conditions = onboardingAnswers.healthConditions || []
    return specializedWorkouts.filter(workout => 
      conditions.includes(workout.condition)
    )
  }

  const getWorkoutForDay = (day: string) => {
    const workouts = weeklyWorkoutsByDay[day]
    if (!workouts) return null
    const weekIndex = (currentWeek - 1) % workouts.length
    return workouts[weekIndex]
  }

  // Função para obter o dia atual da semana
  const getCurrentDayOfWeek = () => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
    const today = new Date().getDay()
    return days[today]
  }

  const getSupplementationPlan = () => {
    const goal = onboardingAnswers.supplementationGoal
    if (!goal || goal === 'Não quero suplementação') return null
    return supplementationPlans[goal as keyof typeof supplementationPlans]
  }

  const remainingCalories = dailyCalories - consumedCalories
  const progressPercentage = (consumedCalories / dailyCalories) * 100

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'} transition-colors duration-300`}>
      {/* Onboarding Modal */}
      {showOnboardingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                  {onboardingQuestions[onboardingStep].title}
                </h2>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {onboardingQuestions[onboardingStep].subtitle}
                </p>
              </div>

              <div className="space-y-6 mb-8">
                {onboardingQuestions[onboardingStep].fields.map((field, index) => (
                  <div key={index}>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      {field.label}
                      {field.recommended && onboardingStep === 8 && (
                        <span className="ml-2 text-green-600 text-xs">
                          (Recomendado: {calculateRecommendedCalories()} kcal)
                        </span>
                      )}
                    </label>
                    {field.type === 'select' && (
                      <select
                        className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        onChange={(e) => setOnboardingAnswers({...onboardingAnswers, [field.name]: e.target.value})}
                      >
                        <option value="">Selecione...</option>
                        {field.options?.map((option, i) => (
                          <option key={i} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                    {field.type === 'number' && (
                      <input
                        type="number"
                        placeholder={field.placeholder}
                        defaultValue={field.recommended ? calculateRecommendedCalories() : undefined}
                        className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        onChange={(e) => setOnboardingAnswers({...onboardingAnswers, [field.name]: parseInt(e.target.value)})}
                      />
                    )}
                    {field.type === 'time' && (
                      <input
                        type="time"
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        onChange={(e) => setOnboardingAnswers({...onboardingAnswers, [field.name]: e.target.value})}
                      />
                    )}
                    {field.type === 'multiselect' && (
                      <div className="grid grid-cols-2 gap-2">
                        {field.options?.map((option, i) => (
                          <label key={i} className={`flex items-center space-x-2 p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl cursor-pointer hover:bg-blue-50`}>
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-blue-600"
                              onChange={(e) => {
                                const current = onboardingAnswers[field.name as keyof OnboardingAnswers] as string[] || []
                                if (e.target.checked) {
                                  setOnboardingAnswers({...onboardingAnswers, [field.name]: [...current, option]})
                                } else {
                                  setOnboardingAnswers({...onboardingAnswers, [field.name]: current.filter(item => item !== option)})
                                }
                              }}
                            />
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                {onboardingStep > 0 && (
                  <button
                    onClick={() => setOnboardingStep(onboardingStep - 1)}
                    className={`px-6 py-3 border-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-xl font-medium transition-colors`}
                  >
                    Voltar
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onboardingStep < onboardingQuestions.length - 1) {
                      setOnboardingStep(onboardingStep + 1)
                    } else {
                      completeOnboarding()
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
                >
                  {onboardingStep < onboardingQuestions.length - 1 ? 'Próximo' : 'Começar Jornada! 🚀'}
                </button>
              </div>

              <div className="mt-6 flex justify-center space-x-2">
                {onboardingQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === onboardingStep ? 'w-8 bg-blue-500' : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Definições</h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                >
                  <X className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Tema */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {darkMode ? <Moon className="w-6 h-6 text-blue-400" /> : <Sun className="w-6 h-6 text-yellow-500" />}
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Modo Escuro</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ativar tema escuro</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Notificações */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {notificationsEnabled ? <Bell className="w-6 h-6 text-green-500" /> : <VolumeX className="w-6 h-6 text-red-500" />}
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Notificações</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Alertas de refeições e treinos</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${notificationsEnabled ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Idioma */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-6 h-6 text-blue-500" />
                      <div>
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Idioma</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Selecione o idioma da aplicação</p>
                      </div>
                    </div>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={`px-4 py-2 ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'} border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="pt">Português</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </div>

                {/* Informações da Conta */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Informações da Conta</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Plano Atual:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {plans.find(p => p.id === selectedPlan)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Meta Diária:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{dailyCalories} kcal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Modal */}
      {showChatbotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl max-w-2xl w-full h-[600px] flex flex-col`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Assistente de Treinos</h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sempre disponível para ajudar</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatbotModal(false)}
                  className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                >
                  <X className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                      : darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Digite sua pergunta ou pedido..."
                  className={`flex-1 px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  onClick={sendChatMessage}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg border-b transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                FitTrack Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:scale-110 transition-all duration-300`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowMetricsModal(true)}
                className="text-right hover:scale-105 transition-transform duration-300"
              >
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Meta Diária</p>
                <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{dailyCalories} kcal</p>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Calorie Counter Tab */}
        {activeTab === 'counter' && (
          <div className="space-y-8">
            {/* Progress Card */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8 transition-colors duration-300`}>
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Progresso Diário</h2>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Acompanhe suas calorias e nutrientes</p>
              </div>
              
              <div className="relative w-64 h-64 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={darkMode ? 'rgb(55 65 81)' : 'rgb(229 231 235)'}
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPercentage * 2.51} 251`}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{consumedCalories}</span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>de {dailyCalories} kcal</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                    {remainingCalories > 0 ? `${remainingCalories} restantes` : 'Meta atingida!'}
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 text-lg font-semibold"
                >
                  <Camera className="w-6 h-6" />
                  <span>Adicionar Refeição por Foto</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Proteína</h3>
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-green-600 font-bold text-lg">P</span>
                  </div>
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{consumedNutrients.protein.toFixed(1)}g</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Consumida hoje</p>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Carboidratos</h3>
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-lg">C</span>
                  </div>
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{consumedNutrients.carbs.toFixed(1)}g</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Consumidos hoje</p>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gorduras</h3>
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <span className="text-red-600 font-bold text-lg">G</span>
                  </div>
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{consumedNutrients.fat.toFixed(1)}g</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Consumidas hoje</p>
              </div>
            </div>
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Receitas Fitness</h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Receitas saudáveis com informação nutricional completa</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowMealSearchModal(true)}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 text-lg font-semibold"
              >
                <Search className="w-6 h-6" />
                <span>Buscar Refeição Mundial</span>
              </button>
              <button
                onClick={() => setShowCreateRecipeModal(true)}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 text-lg font-semibold"
              >
                <Plus className="w-6 h-6" />
                <span>Criar Receita Personalizada</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe, index) => (
                <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300`}>
                  <img 
                    src={recipe.image} 
                    alt={recipe.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>{recipe.name}</h3>
                    
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-4 mb-4">
                      <div className="text-center">
                        <span className="text-3xl font-bold">{recipe.calories}</span>
                        <span className="text-sm ml-1">kcal</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Proteína</p>
                        <p className="font-bold text-green-600">{recipe.protein}g</p>
                      </div>
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Carboidratos</p>
                        <p className="font-bold text-orange-600">{recipe.carbs}g</p>
                      </div>
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gordura</p>
                        <p className="font-bold text-red-600">{recipe.fat}g</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => addCalories(recipe.calories)}
                      className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      Adicionar ao Contador
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workouts Tab */}
        {activeTab === 'workouts' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Planos de Treino</h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Treinos personalizados para todas as necessidades</p>
            </div>

            {/* Chatbot Button */}
            {(selectedPlan === 'advanced' || selectedPlan === 'athlete') && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowChatbotModal(true)}
                  className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 text-lg font-semibold"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Assistente de Treinos - Tire Dúvidas e Personalize</span>
                </button>
              </div>
            )}

            {/* Week Selector */}
            {(selectedPlan === 'advanced' || selectedPlan === 'athlete') && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-6`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <Calendar className="inline w-6 h-6 mr-2" />
                    Semana {currentWeek} - Planos Rotativos
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentWeek(currentWeek === 1 ? 2 : 1)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      {currentWeek === 1 ? 'Ver Semana 2' : 'Ver Semana 1'}
                    </button>
                  </div>
                </div>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Seus treinos mudam automaticamente toda semana para máximos resultados
                </p>
              </div>
            )}

            {selectedPlan === 'advanced' || selectedPlan === 'athlete' ? (
              <>
                {/* Specialized Workouts - Conditional */}
                {shouldShowSpecializedWorkouts() && (
                  <div className="space-y-8">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} text-center`}>
                      Treinos Especializados Personalizados
                    </h3>
                    
                    {getVisibleSpecializedWorkouts().map((category, catIndex) => {
                      const IconComponent = category.icon
                      return (
                        <div key={catIndex} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8`}>
                          <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{category.category}</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {category.workouts.map((workout, index) => (
                              <div key={index} className={`${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-50 to-pink-50'} rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}>
                                <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>{workout.name}</h5>
                                <div className="space-y-2 mb-4 text-sm">
                                  <div className="flex justify-between">
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Duração:</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{workout.duration}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Exercícios:</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{workout.exercises}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Nível:</span>
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{workout.level}</span>
                                  </div>
                                </div>
                                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                                  <Play className="w-4 h-4" />
                                  <span>Iniciar</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Today's Training Schedule */}
                {onboardingAnswers.trainingDays && onboardingAnswers.trainingDays.length > 0 && (
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8`}>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                      Treino de Hoje - {getCurrentDayOfWeek()}
                    </h3>
                    
                    {(() => {
                      const today = getCurrentDayOfWeek()
                      const isTrainingDay = onboardingAnswers.trainingDays.includes(today)
                      
                      if (!isTrainingDay) {
                        return (
                          <div className={`text-center py-12 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-cyan-50'} rounded-2xl`}>
                            <Heart className={`w-16 h-16 ${darkMode ? 'text-gray-500' : 'text-blue-400'} mx-auto mb-4`} />
                            <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                              Dia de Descanso
                            </h4>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              Hoje não está nos seus dias de treino. Aproveite para recuperar!
                            </p>
                          </div>
                        )
                      }

                      const workout = getWorkoutForDay(today)
                      if (!workout) return null
                      
                      return (
                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-cyan-50'} rounded-2xl p-6`}>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {workout.muscleGroup}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700`}>
                              Semana {currentWeek}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {workout.exercises.map((exercise, exIndex) => (
                              <div key={exIndex} className={`${darkMode ? 'bg-gray-600' : 'bg-white'} rounded-xl p-4`}>
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{exercise.name}</p>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {exercise.sets} séries × {exercise.reps} reps
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      {exercise.gymVersion && (
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Ginásio</span>
                                      )}
                                      {exercise.homeVersion && (
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Casa</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end space-y-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                      {exercise.rest} descanso
                                    </span>
                                    <a
                                      href={exercise.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-1 text-xs px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                      <Play className="w-3 h-3" />
                                      <span>Vídeo</span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                            <Play className="w-5 h-5" />
                            <span>Iniciar Treino de Hoje</span>
                          </button>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Athlete Exclusive Features */}
                {selectedPlan === 'athlete' && (
                  <>
                    {/* Activity Selector */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-6`}>
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Atividades de Resistência</h3>
                      <div className="flex overflow-x-auto space-x-4 pb-4">
                        {activities.map((activity) => {
                          const IconComponent = activity.icon
                          return (
                            <button
                              key={activity.id}
                              onClick={() => setSelectedActivity(activity.id)}
                              className={`flex-shrink-0 flex flex-col items-center space-y-2 px-6 py-4 rounded-2xl transition-all duration-300 ${
                                selectedActivity === activity.id
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <IconComponent className="w-8 h-8" />
                              <span className="font-medium whitespace-nowrap">{activity.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Road To Plans */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8`}>
                      <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                        🏆 Planos Road to - {activities.find(a => a.id === selectedActivity)?.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roadToPlans[selectedActivity]?.map((plan, index) => (
                          <div key={index} className={`${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-cyan-50'} rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}>
                            <div className="flex items-start justify-between mb-4">
                              <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{plan.name}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                plan.level === 'Iniciante' ? 'bg-green-100 text-green-700' :
                                plan.level === 'Intermediário' ? 'bg-blue-100 text-blue-700' :
                                plan.level === 'Avançado' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {plan.level}
                              </span>
                            </div>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Duração: {plan.duration}</p>
                            <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                              <Play className="w-5 h-5" />
                              <span>Iniciar Plano</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sport Categories */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-6`}>
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Desportos Específicos</h3>
                      <div className="flex overflow-x-auto space-x-4 pb-4">
                        {sportCategories.map((sport) => {
                          const IconComponent = sport.icon
                          return (
                            <button
                              key={sport.id}
                              onClick={() => setSelectedSportCategory(sport.id)}
                              className={`flex-shrink-0 flex flex-col items-center space-y-2 px-6 py-4 rounded-2xl transition-all duration-300 ${
                                selectedSportCategory === sport.id
                                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <IconComponent className="w-8 h-8" />
                              <span className="font-medium whitespace-nowrap">{sport.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Sport-Specific Plans */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8`}>
                      <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                        ⚽ Planos para {sportCategories.find(s => s.id === selectedSportCategory)?.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sportPlans[selectedSportCategory]?.map((plan, index) => (
                          <div key={index} className={`${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-orange-50 to-red-50'} rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}>
                            <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>{plan.name}</h4>
                            <div className="space-y-2 mb-4">
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span className="font-medium">Duração:</span> {plan.duration}
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span className="font-medium">Foco:</span> {plan.focus}
                              </p>
                            </div>
                            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                              <Play className="w-5 h-5" />
                              <span>Iniciar Plano</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-12 text-center`}>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Planos de Treino Disponíveis nos Planos Premium</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
                  Para aceder aos planos de treino personalizados, exercícios especializados e planos Road to, 
                  faça upgrade para o plano Advanced ou Athlete.
                </p>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300"
                >
                  Ver Planos Premium
                </button>
              </div>
            )}
          </div>
        )}

        {/* Supplementation Tab */}
        {activeTab === 'supplementation' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Plano de Suplementação</h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Suplementos personalizados para seus objetivos</p>
            </div>

            {selectedPlan === 'athlete' ? (
              <>
                {getSupplementationPlan() ? (
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8`}>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <Pill className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          Plano Personalizado
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Objetivo: {onboardingAnswers.supplementationGoal}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {getSupplementationPlan()?.map((supplement, index) => (
                        <div key={index} className={`${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-orange-50 to-red-50'} rounded-2xl p-6`}>
                          <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{supplement.name}</h4>
                          <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Dosagem:</span>
                              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{supplement.dosage}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Momento:</span>
                              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{supplement.timing}</span>
                            </div>
                          </div>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{supplement.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className={`mt-6 p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-xl`}>
                      <div className="flex items-start space-x-3">
                        <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Notificações Ativas
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                            Você receberá lembretes 5 minutos antes de cada horário de suplementação nos dias de treino
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-12 text-center`}>
                    <Pill className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`} />
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Configure Seu Plano de Suplementação</h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
                      Complete o questionário inicial para receber um plano de suplementação personalizado baseado nos seus objetivos.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-12 text-center`}>
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Planos de Suplementação Exclusivos do Plano Athlete</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
                  Para aceder aos planos de suplementação personalizados e notificações inteligentes, 
                  faça upgrade para o plano Athlete.
                </p>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300"
                >
                  Ver Plano Athlete
                </button>
              </div>
            )}
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Escolha Seu Plano</h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Desbloqueie todo o potencial do seu treino</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const IconComponent = plan.icon
                return (
                  <div 
                    key={plan.id}
                    className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 ${
                      selectedPlan === plan.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                    } ${plan.popular ? 'scale-105' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>MAIS POPULAR</span>
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{plan.name}</h3>
                      <div className="flex items-baseline justify-center">
                        <span className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{plan.price}</span>
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-1`}>{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className={`w-5 h-5 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                        selectedPlan === plan.id
                          ? `bg-gradient-to-r ${plan.color} text-white shadow-lg`
                          : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {selectedPlan === plan.id ? 'Plano Selecionado' : 'Escolher Plano'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t shadow-2xl transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto space-x-2 py-3">
            {[
              { id: 'counter', label: 'Contador', icon: Target },
              { id: 'recipes', label: 'Receitas', icon: Utensils },
              { id: 'workouts', label: 'Treinos', icon: Dumbbell },
              { id: 'supplementation', label: 'Suplementação', icon: Pill },
              { id: 'plans', label: 'Planos', icon: Crown },
              { id: 'settings', label: 'Definições', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => tab.id === 'settings' ? setShowSettingsModal(true) : setActiveTab(tab.id)}
                className={`flex-shrink-0 flex flex-col items-center space-y-1 px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Modal */}
      {showMetricsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Métricas Nutricionais</h3>
                <button
                  onClick={() => setShowMetricsModal(false)}
                  className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                >
                  <X className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold mb-1">{consumedNutrients.calories}</div>
                  <div className="text-lg">calorias totais</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className={`text-center p-4 ${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-2xl`}>
                    <div className="text-2xl font-bold text-green-600">{consumedNutrients.protein.toFixed(1)}g</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-green-700'}`}>Proteína</div>
                  </div>
                  <div className={`text-center p-4 ${darkMode ? 'bg-gray-700' : 'bg-orange-50'} rounded-2xl`}>
                    <div className="text-2xl font-bold text-orange-600">{consumedNutrients.carbs.toFixed(1)}g</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-orange-700'}`}>Carboidratos</div>
                  </div>
                  <div className={`text-center p-4 ${darkMode ? 'bg-gray-700' : 'bg-red-50'} rounded-2xl`}>
                    <div className="text-2xl font-bold text-red-600">{consumedNutrients.fat.toFixed(1)}g</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-red-700'}`}>Gorduras</div>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                  <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Micronutrientes</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fibras:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{consumedNutrients.fiber.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Açúcares:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{consumedNutrients.sugar.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Sódio:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{consumedNutrients.sodium.toFixed(0)}mg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Cálcio:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{consumedNutrients.calcium.toFixed(0)}mg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Ferro:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{consumedNutrients.iron.toFixed(1)}mg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Vitamina C:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{consumedNutrients.vitaminC.toFixed(0)}mg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Vitamina A:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{consumedNutrients.vitaminA.toFixed(0)}μg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Potássio:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{consumedNutrients.potassium.toFixed(0)}mg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meal Search Modal */}
      {showMealSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Buscar Refeição Mundial</h3>
                <button
                  onClick={() => setShowMealSearchModal(false)}
                  className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                >
                  <X className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'} w-5 h-5`} />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou culinária..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMeals.map((meal, index) => (
                  <div key={index} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300`}>
                    <img src={meal.image} alt={meal.name} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{meal.name}</h4>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{meal.cuisine}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                        <div className="text-center">
                          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Cal</p>
                          <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{meal.calories}</p>
                        </div>
                        <div className="text-center">
                          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Prot</p>
                          <p className="font-bold text-green-600">{meal.protein}g</p>
                        </div>
                        <div className="text-center">
                          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Carb</p>
                          <p className="font-bold text-orange-600">{meal.carbs}g</p>
                        </div>
                        <div className="text-center">
                          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Gord</p>
                          <p className="font-bold text-red-600">{meal.fat}g</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addMealWithNutrients(meal)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Recipe Modal */}
      {showCreateRecipeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Criar Receita Personalizada</h3>
                <button
                  onClick={() => setShowCreateRecipeModal(false)}
                  className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                >
                  <X className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Nome da Receita</label>
                  <input
                    type="text"
                    placeholder="Ex: Meu Smoothie Especial"
                    className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Calorias</label>
                    <input
                      type="number"
                      placeholder="350"
                      className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Proteína (g)</label>
                    <input
                      type="number"
                      placeholder="25"
                      className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Carboidratos (g)</label>
                    <input
                      type="number"
                      placeholder="40"
                      className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Gorduras (g)</label>
                    <input
                      type="number"
                      placeholder="12"
                      className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Fibras (g)</label>
                    <input
                      type="number"
                      placeholder="5"
                      className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Sódio (mg)</label>
                    <input
                      type="number"
                      placeholder="450"
                      className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Ingredientes</label>
                  <textarea
                    placeholder="Liste os ingredientes e quantidades..."
                    rows={4}
                    className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowCreateRecipeModal(false)
                      // Aqui seria salvo na base de dados
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300"
                  >
                    Salvar Receita
                  </button>
                  <button
                    onClick={() => setShowCreateRecipeModal(false)}
                    className={`px-6 py-4 border-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-2xl font-medium transition-colors`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Análise Nutricional</h3>
                <button
                  onClick={closeAnalysisModal}
                  className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                >
                  <X className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              {capturedImage && (
                <div className="mb-6">
                  <img 
                    src={capturedImage} 
                    alt="Foto analisada" 
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                </div>
              )}

              {isAnalyzing ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                  <h4 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>Analisando sua refeição...</h4>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Identificando alimentos e calculando nutrientes</p>
                </div>
              ) : analysisResult ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{analysisResult.foodName}</h4>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{analysisResult.portion}</p>
                    <div className="inline-flex items-center space-x-2 mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      <span>Confiança: {analysisResult.confidence}%</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold mb-1">{analysisResult.nutritionalInfo.calories}</div>
                    <div className="text-lg">calorias</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className={`text-center p-4 ${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-2xl`}>
                      <div className="text-2xl font-bold text-green-600">{analysisResult.nutritionalInfo.protein}g</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-green-700'}`}>Proteína</div>
                    </div>
                    <div className={`text-center p-4 ${darkMode ? 'bg-gray-700' : 'bg-orange-50'} rounded-2xl`}>
                      <div className="text-2xl font-bold text-orange-600">{analysisResult.nutritionalInfo.carbs}g</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-orange-700'}`}>Carboidratos</div>
                    </div>
                    <div className={`text-center p-4 ${darkMode ? 'bg-gray-700' : 'bg-red-50'} rounded-2xl`}>
                      <div className="text-2xl font-bold text-red-600">{analysisResult.nutritionalInfo.fat}g</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-red-700'}`}>Gorduras</div>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                    <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Informação Nutricional Detalhada</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fibras:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{analysisResult.nutritionalInfo.fiber}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Açúcares:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{analysisResult.nutritionalInfo.sugar}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Sódio:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{analysisResult.nutritionalInfo.sodium}mg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Cálcio:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{analysisResult.nutritionalInfo.calcium}mg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Ferro:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{analysisResult.nutritionalInfo.iron}mg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Vitamina C:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{analysisResult.nutritionalInfo.vitaminC}mg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Vitamina A:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{analysisResult.nutritionalInfo.vitaminA}μg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Potássio:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{analysisResult.nutritionalInfo.potassium}mg</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={addAnalyzedFood}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300"
                    >
                      Adicionar ao Contador
                    </button>
                    <button
                      onClick={closeAnalysisModal}
                      className={`px-6 py-4 border-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-2xl font-medium transition-colors`}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
