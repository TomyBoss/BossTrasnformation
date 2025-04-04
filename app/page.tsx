import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
 
export default function TrainingApp() {
  const [completed, setCompleted] = useState({});
  const [notes, setNotes] = useState("");
  const [weights, setWeights] = useState([]);
  const [inputWeight, setInputWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [message, setMessage] = useState("");
  const [reminder, setReminder] = useState("");
  const [foodNotes, setFoodNotes] = useState("");
  const [mealPrepNotes, setMealPrepNotes] = useState("");
  const [progressImages, setProgressImages] = useState([]);
 
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 9 && hour < 12) {
      setReminder("Schon gewogen heute? Jetzt wäre ein guter Zeitpunkt! ☀️");
    } else if (hour >= 17 && hour < 20) {
      setReminder("Abendroutine! Hast du dein Gewicht eingetragen? 🌙");
    } else {
      setReminder("");
    }
  }, []);
 
  const toggleComplete = (exercise) => {
    setCompleted((prev) => ({ ...prev, [exercise]: !prev[exercise] }));
  };
 
  const handleAddWeight = () => {
    if (!inputWeight) return;
    const date = new Date().toLocaleDateString();
    const newWeight = parseFloat(inputWeight);
    const newWeights = [...weights, { date, weight: newWeight }];
    setWeights(newWeights);
    setInputWeight("");
 
    if (newWeights.length > 1) {
      const lastWeight = newWeights[newWeights.length - 2].weight;
      if (newWeight < lastWeight) {
        const motivators = [
          "Nice! Du bist leichter als letzte Woche! 🔥",
          "Starker Fortschritt – keep it up! 💪",
          "Kilos schmelzen! Weiter so! 🧊",
          "Das Training zahlt sich aus! 🎯"
        ];
        const msg = motivators[Math.floor(Math.random() * motivators.length)];
        setMessage(msg);
      } else {
        setMessage("");
      }
    }
  };
 
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setProgressImages((prev) => [...prev, ...urls]);
  };
 
  const exercisesA = [
    "Beinpresse (3x15)",
    "Beinbeuger Maschine (3x12)",
    "Abduktoren Maschine (3x15)",
    "Ausfallschritte (3x12 je Seite)",
    "Crunchmaschine (3x15)",
    "Plank (3x 30–45 Sek.)",
  ];
 
  const currentWeight = weights.length > 0 ? weights[weights.length - 1].weight : null;
  const progressToGoal = goalWeight && currentWeight ? Math.max(0, Math.min(100, ((parseFloat(goalWeight) < currentWeight)
    ? (1 - (currentWeight - parseFloat(goalWeight)) / (weights[0]?.weight - parseFloat(goalWeight))) * 100
    : 100)) : 0;
 
  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Trainingsplan App</h1>
      {reminder && <p className="text-center text-sm text-blue-600">{reminder}</p>}
      <Tabs defaultValue="a" className="w-full">
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="a">Training A</TabsTrigger>
          <TabsTrigger value="notes">Notizen</TabsTrigger>
          <TabsTrigger value="progress">Fortschritt</TabsTrigger>
          <TabsTrigger value="weight">Gewicht</TabsTrigger>
          <TabsTrigger value="nutrition">Ernährung</TabsTrigger>
          <TabsTrigger value="mealprep">Meal Prep</TabsTrigger>
        </TabsList>
 
        <TabsContent value="a">
          <Card>
            <CardContent className="p-4 space-y-4">
              {exercisesA.map((exercise, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className={completed[exercise] ? "line-through text-muted" : ""}>{exercise}</span>
                  <Button
                    size="sm"
                    variant={completed[exercise] ? "outline" : "default"}
                    onClick={() => toggleComplete(exercise)}
                  >
                    {completed[exercise] ? "Rückgängig" : "Erledigt"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
 
        <TabsContent value="notes">
          <Card>
            <CardContent className="p-4 space-y-4">
              <Textarea
                placeholder="Schreibe hier deine Gedanken, Gewichte oder Mahlzeiten auf..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>
 
        <TabsContent value="progress">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-lg font-semibold">Wochenfortschritt</h2>
              <div className="space-y-2">
                <span>Trainingseinheit A abgeschlossen:</span>
                <Progress value={Object.values(completed).filter(Boolean).length / exercisesA.length * 100} />
              </div>
              <h2 className="text-lg font-semibold pt-4">Fortschrittsfotos</h2>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
              <div className="grid grid-cols-2 gap-4 mt-4">
                {progressImages.map((src, index) => (
                  <img key={index} src={src} alt={`Fortschritt ${index + 1}`} className="rounded shadow" />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
 
        <TabsContent value="weight">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-lg font-semibold">Gewichtstracker</h2>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Gewicht in kg"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                />
                <Button onClick={handleAddWeight}>Speichern</Button>
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Zielgewicht (kg)"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                />
              </div>
              {goalWeight && currentWeight && (
                <div className="space-y-2">
                  <span>Fortschritt zum Zielgewicht:</span>
                  <Progress value={progressToGoal} />
                </div>
              )}
              {message && <p className="text-green-600 font-semibold">{message}</p>}
              {weights.length > 0 && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weights} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
 
        <TabsContent value="nutrition">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-lg font-semibold">Ernährungstracker & Tipps</h2>
              <Textarea
                placeholder="Was hast du heute gegessen? Frühstück, Mittag, Snack, Abendessen..."
                value={foodNotes}
                onChange={(e) => setFoodNotes(e.target.value)}
              />
              <div className="space-y-2">
                <h3 className="font-semibold">🚫 Vermeide möglichst:</h3>
                <ul className="list-disc list-inside text-sm">
                  <li>Gezuckerte Getränke & Fruchtsäfte</li>
                  <li>Weißbrot & Weißmehlprodukte</li>
                  <li>Fertiggerichte mit vielen Zusatzstoffen</li>
                  <li>Snacks wie Chips, Schokoriegel, Gummibärchen</li>
                  <li>Alkohol – hemmt die Fettverbrennung!</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">✅ Richtig starke Fatburner:</h3>
                <ul className="list-disc list-inside text-sm">
                  <li>Magerquark, Hüttenkäse, Skyr</li>
                  <li>Hähnchen, Pute, Fisch</li>
                  <li>Brokkoli, Spinat, Zucchini</li>
                  <li>Haferflocken, Vollkornreis, Linsen</li>
                  <li>Grüner Tee, schwarzer Kaffee</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
 
        <TabsContent value="mealprep">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-lg font-semibold">Meal Prep Übersicht</h2>
              <Textarea
                placeholder="Plane hier deine 4 Mahlzeiten für die Woche – einfach, proteinreich, schnell."
                value={mealPrepNotes}
                onChange={(e) => setMealPrepNotes(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Vorschläge: Hähnchen mit Brokkoli & Reis • Putenhack mit Zucchini-Nudeln • Linsen-Curry mit Spinat • Thunfisch-Quark mit Haferflocken
              </p>
            </CardContent>
          </Card>
        </TabsContent>
 
      </Tabs>
    </div>
  );
}
