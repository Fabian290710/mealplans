import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.min.js'

// ⚠️ Nur den anon key im Frontend nutzen!
const SUPABASE_URL = 'https://xyzcompany.supabase.co' // DEINE SUPABASE URL
const SUPABASE_ANON_KEY = 'sb_publishable_3U-G-5GD22ifueP4W0ghPw_gHLsSb7M'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const saveBtn = document.getElementById('saveBtn')
const loadBtn = document.getElementById('loadBtn')
const output = document.getElementById('output')

// Hilfsfunktion: Plan aus Inputs erstellen
function getMealPlan() {
  const days = document.querySelectorAll('.day')
  const plan = {}
  days.forEach(day => {
    const label = day.querySelector('label').innerText.replace(':','')
    const meal = day.querySelector('input').value
    plan[label] = meal
  })
  return plan
}

// Hilfsfunktion: Inputs aus Plan füllen
function setMealPlan(plan) {
  const days = document.querySelectorAll('.day')
  days.forEach(day => {
    const label = day.querySelector('label').innerText.replace(':','')
    day.querySelector('input').value = plan[label] || ''
  })
}

// Speichern
saveBtn.addEventListener('click', async () => {
  const mealPlan = getMealPlan()
  try {
    const { data, error } = await supabase
      .from('mealplans')
      .insert([{ plan: mealPlan }])
    if(error) throw error
    alert('Essensplan gespeichert!')
  } catch(e) {
    console.error(e)
    alert('Fehler beim Speichern')
  }
})

// Laden (letzter Plan)
loadBtn.addEventListener('click', async () => {
  try {
    const { data, error } = await supabase
      .from('mealplans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if(error) throw error
    if(data.length === 0) return alert('Keine Pläne gefunden!')

    setMealPlan(data[0].plan)
    output.textContent = JSON.stringify(data[0].plan, null, 2)
  } catch(e) {
    console.error(e)
    alert('Fehler beim Laden')
  }
})
