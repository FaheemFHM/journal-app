
import os
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

  def random_recent_datetime(max_days=7):
      delta = timedelta(
          days = 0 if random_bool(0.15) else random.randint(0, max_days),
          hours = 0 if random_bool(0.35) else random.randint(0, 23),
          minutes = 0 if random_bool(0.5) else random.randint(0, 59)
      )
      return (datetime.utcnow() - delta).isoformat(timespec="milliseconds") + "Z"

  # ===== values =====

  num_projects = get_user_input("Project count: ", 20)
  min_notes = get_user_input("Note count min: ", 3)
  max_notes = get_user_input("Note count max: ", 70)
  
  projects = []
  notes = []

  note_id = 1

  # ===== generate projects =====
  for project_id in range(1, num_projects + 1):
    project = {
        "id": project_id,
        "title": random_project(),
        "datetimecreated": random_recent_datetime(59),
        "datetimemodified": random_recent_datetime(14),
        "datetimedeleted": None,
        "ispinned": random_bool(0.2),
        "isstarred": random_bool(0.3),
        "isarchived": random_bool(0.1),
        "isdeleted": False
    }
    projects.append(project)

    # ===== generate notes per project =====

    num_notes = random.randint(min_notes, max_notes)

    for i in range(num_notes):
      note = {
          "id": note_id,
          "project_id": project_id,
          "text": random_note(),
          "position": float(i + 1),
          "datetimecreated": random_recent_datetime(59),
          "datetimemodified": random_recent_datetime(14),
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

  tmp_file = OUTPUT_FILE + ".tmp"
  with open(tmp_file, "w", encoding="utf-8") as f:
      json.dump(data, f, indent=2)
  os.replace(tmp_file, OUTPUT_FILE)

  with open(OUTPUT_FILE) as f:
      try:
          json.load(f)
          print("\n=======\n")
          print(f"{len(projects)} Projects")
          print(f"{len(notes)} Notes")
          print(f"File: {OUTPUT_FILE}")
          print("\n=======\n")
          
      except json.JSONDecodeError as e:
          print("JSON invalid:", e)

  input("Press ENTER to quit... ")

if __name__ == "__main__":
    main()
