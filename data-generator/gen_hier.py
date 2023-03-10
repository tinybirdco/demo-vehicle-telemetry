import datetime
import csv
import random
import uuid
from faker import Faker
fake = Faker()

SAMPLE = 1_000_000

def generate_hierarchy():
  headers = ['client_name','vehicle_id','license_plate']
  print(datetime.datetime.now())

  file_name = 'vehicle_hier.csv'
  
  company_choices = [fake.company() for _ in range(1000)]
  company_weights = [random.random() for _ in range(len(company_choices))]
  companies = random.choices(company_choices,company_weights,k=SAMPLE)

  with open (f'./datasources/fixtures/{file_name}','w') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(headers)
    for _ in range(SAMPLE):
      client_name = companies[_]
      vehicle_id = _ + 1000000
      license_plate = fake.license_plate()
      writer.writerow([client_name,vehicle_id,license_plate])
  print(datetime.datetime.now())
  print(file_name)
  return(file_name) 
 
if __name__ == '__main__':
 generate_hierarchy()