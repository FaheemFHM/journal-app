
import json
import random
from datetime import datetime, timedelta
import random

WORDS = (
    "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
).split()

def main():
  # ===== helpers =====

  def random_note(min_words=6, max_words=100):
    length = random.randint(min_words, max_words)
    words = random.choices(WORDS, k=length)
    sentence = " ".join(words)
    return sentence.capitalize() + "."

  def random_project(min_words=1, max_words=3):
    length = random.randint(min_words, max_words)
    words = random.choices(WORDS, k=length)
    sentence = " ".join(words)
    return sentence.title()
    
  def get_user_input(txt, num):
    x = input(txt)
    try:
      x = int(x)
      x = num if x < 0 else x
    except:
      x = num
    return x

  def random_bool(weight=0.5):
      return random.random() < weight

  def random_date(start=datetime(2026, 1, 1, 9, 0, 0)):
      return start + timedelta(minutes=random.randint(0, 1000))

  def iso(dt):
      return dt.strftime("%Y-%m-%dT%H:%M:%SZ")

  # ===== values =====

  num_projects = get_user_input("Project count: ", 20)
  min_notes = get_user_input("Note count min: ", 3)
  max_notes = get_user_input("Note count max: ", 70)

  projects = []
  notes = []

  note_id = 1

  # ===== generate projects =====

  for project_id in range(1, num_projects + 1):
      created = random_date()
      modified = created + timedelta(minutes=random.randint(10, 500))

      project = {
          "id": project_id,
          "title": random_project(),
          "datetimecreated": iso(created),
          "datetimemodified": iso(modified),
          "ispinned": random_bool(0.2),
          "isstarred": random_bool(0.3),
          "isarchived": random_bool(0.1)
      }
      projects.append(project)

      # ===== generate notes per project =====

      num_notes = random.randint(min_notes, max_notes)

      for i in range(num_notes):
          n_created = created + timedelta(minutes=i * 5)
          n_modified = n_created + timedelta(minutes=random.randint(1, 60))

          note = {
              "id": note_id,
              "project_id": project_id,
              "text": random_note(),
              "position": float(i + 1),
              "datetimecreated": iso(n_created),
              "datetimemodified": iso(n_modified),
              "ispinned": random_bool(0.1),
              "isstarred": random_bool(0.2)
          }
          notes.append(note)
          note_id += 1
          
  data = {
      "projects": projects,
      "notes": notes
  }

  # ===== save =====

  OUTPUT_FILE = "db.json"

  with open(OUTPUT_FILE, "w") as f:
      json.dump(data, f, indent=2)
      
  print("\n=======\n")
  print(f"{len(projects)} Projects")
  print(f"{len(notes)} Notes")
  print(f"File: {OUTPUT_FILE}")
  print("\n=======\n")

  input("Press ENTER to quit... ")

if __name__ == "__main__":
    main()
