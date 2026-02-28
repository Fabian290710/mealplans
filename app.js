import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.min.js'

const SUPABASE_URL = 'https://vnpxywdypxtawjuwbcck.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucHh5d2R5cHh0YXdqdXdiY2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDkxNDMsImV4cCI6MjA4Nzg4NTE0M30.ZlpLu6AJy0m_9PLfm1CQ0-pkS436OqWKGnMezFuUm98'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const days = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"]
const mealInputs = document.querySelectorAll('.meal')
const saveBtn = document.getElementById('saveBtn')
const loadBtn = document.getElementById('loadBtn')
const output = document.getElementById('output')

function getMealPlan() {
  const plan = {}
  mealInputs.forEach((input, i) => plan[days[i]] = input.value)
  return plan
}

function setMealPlan(plan) {
  mealInputs.forEach((input,i) => input.value = plan[days[i]] || "")
}

saveBtn.addEventListener('click', async () => {
  const plan = getMealPlan()
  const { data, error } = await supabase.from('mealplans').insert([{ plan }])
  if(error) return alert("Fehler beim Speichern: " + error.message)
  alert("✅ Plan gespeichert!")
})

loadBtn.addEventListener('click', async () => {
  const { data, error } = await supabase
    .from('mealplans')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
  if(error) return alert("Fehler beim Laden: " + error.message)
  if(data.length===0) return alert("Keine Pläne gefunden")
  setMealPlan(data[0].plan)
  output.textContent = JSON.stringify(data[0].plan,null,2)
})
