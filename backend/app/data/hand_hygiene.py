"""Hand Hygiene period datasets matching handHygienePeriodData.js."""

TODAY = {
    "groupSummary": [
        {"group": "Nurses", "total": 45, "moment1Comp": "88%", "moment1Non": "8%", "nonOpp": "4%"},
        {"group": "Doctors", "total": 32, "moment1Comp": "72%", "moment1Non": "18%", "nonOpp": "10%"},
        {"group": "HCAs", "total": 28, "moment1Comp": "84%", "moment1Non": "10%", "nonOpp": "6%"},
        {"group": "Nurse Students", "total": 12, "moment1Comp": "80%", "moment1Non": "12%", "nonOpp": "8%"},
        {"group": "Cleaners", "total": 20, "moment1Comp": "90%", "moment1Non": "6%", "nonOpp": "4%"},
        {"group": "Porters", "total": 10, "moment1Comp": "70%", "moment1Non": "20%", "nonOpp": "10%"},
        {"group": "Visitors", "total": 15, "moment1Comp": "76%", "moment1Non": "14%", "nonOpp": "10%"},
    ],
    "locationObs": [
        {"location": "Bay A SPZ001", "moment1Comp": 12, "moment1Non": 4, "nonOpp": 2, "failure": "Touched Before"},
        {"location": "Bay B SPZ007", "moment1Comp": 8, "moment1Non": 6, "nonOpp": 1, "failure": "Dose 0/1"},
        {"location": "Bay C SPZ013", "moment1Comp": 10, "moment1Non": 3, "nonOpp": 2, "failure": "Time <20s"},
        {"location": "Bay D SPZ019", "moment1Comp": 9, "moment1Non": 5, "nonOpp": 1, "failure": "Touched Before"},
    ],
    "qualityCriteria": [
        {"group": "Nurses", "dose": "2", "doseOk": True, "coverage": "Yes", "coverageOk": True, "contact": ">20s", "contactOk": True, "touch": "After", "touchOk": True},
        {"group": "Doctors", "dose": "1", "doseOk": False, "coverage": "No", "coverageOk": False, "contact": "<20s", "contactOk": False, "touch": "Before", "touchOk": False},
        {"group": "HCAs", "dose": "2", "doseOk": True, "coverage": "Yes", "coverageOk": True, "contact": ">20s", "contactOk": True, "touch": "After", "touchOk": True},
        {"group": "Nurse Students", "dose": "2", "doseOk": True, "coverage": "Yes", "coverageOk": True, "contact": ">20s", "contactOk": True, "touch": "After", "touchOk": True},
        {"group": "Cleaners", "dose": "0", "doseOk": False, "coverage": "No", "coverageOk": False, "contact": "<20s", "contactOk": False, "touch": "Before", "touchOk": False},
        {"group": "Porters", "dose": "1", "doseOk": False, "coverage": "No", "coverageOk": False, "contact": "<20s", "contactOk": False, "touch": "Before", "touchOk": False},
        {"group": "Visitors", "dose": "1", "doseOk": False, "coverage": "No", "coverageOk": False, "contact": "<20s", "contactOk": False, "touch": "Before", "touchOk": False},
    ],
    "dispenserStats": [
        {"location": "Bay A SPZ001", "totalDisp": 45, "volumeMl": 90, "price": "4.50"},
        {"location": "Bay B SPZ007", "totalDisp": 32, "volumeMl": 64, "price": "3.20"},
        {"location": "Bay C SPZ013", "totalDisp": 28, "volumeMl": 56, "price": "2.80"},
    ],
    "gloves": [
        {"group": "Nurses", "moment2": "92%", "moment3": "88%", "misuse": "8%"},
        {"group": "Doctors", "moment2": "78%", "moment3": "72%", "misuse": "15%"},
        {"group": "HCAs", "moment2": "86%", "moment3": "82%", "misuse": "10%"},
        {"group": "Nurse Students", "moment2": "84%", "moment3": "80%", "misuse": "12%"},
    ],
}

WEEK = {
    "groupSummary": [
        {"group": "Nurses", "total": 210, "moment1Comp": "85%", "moment1Non": "10%", "nonOpp": "5%"},
        {"group": "Doctors", "total": 148, "moment1Comp": "74%", "moment1Non": "16%", "nonOpp": "10%"},
        {"group": "HCAs", "total": 132, "moment1Comp": "82%", "moment1Non": "12%", "nonOpp": "6%"},
        {"group": "Nurse Students", "total": 58, "moment1Comp": "78%", "moment1Non": "14%", "nonOpp": "8%"},
        {"group": "Cleaners", "total": 95, "moment1Comp": "88%", "moment1Non": "8%", "nonOpp": "4%"},
        {"group": "Porters", "total": 42, "moment1Comp": "68%", "moment1Non": "22%", "nonOpp": "10%"},
        {"group": "Visitors", "total": 70, "moment1Comp": "73%", "moment1Non": "17%", "nonOpp": "10%"},
    ],
    "locationObs": [
        {"location": "Bay A SPZ001", "moment1Comp": 54, "moment1Non": 18, "nonOpp": 8, "failure": "Touched Before"},
        {"location": "Bay B SPZ007", "moment1Comp": 40, "moment1Non": 22, "nonOpp": 5, "failure": "Dose 0/1"},
        {"location": "Bay C SPZ013", "moment1Comp": 48, "moment1Non": 14, "nonOpp": 9, "failure": "Time <20s"},
        {"location": "Bay D SPZ019", "moment1Comp": 44, "moment1Non": 20, "nonOpp": 6, "failure": "Touched Before"},
        {"location": "Bay A SPZ003", "moment1Comp": 36, "moment1Non": 12, "nonOpp": 4, "failure": "No Rub"},
    ],
    "qualityCriteria": [
        {"group": "Nurses", "dose": "2", "doseOk": True, "coverage": "Yes", "coverageOk": True, "contact": ">20s", "contactOk": True, "touch": "After", "touchOk": True},
        {"group": "Doctors", "dose": "2", "doseOk": True, "coverage": "Yes", "coverageOk": True, "contact": "<20s", "contactOk": False, "touch": "After", "touchOk": True},
        {"group": "HCAs", "dose": "2", "doseOk": True, "coverage": "Yes", "coverageOk": True, "contact": ">20s", "contactOk": True, "touch": "After", "touchOk": True},
        {"group": "Nurse Students", "dose": "1", "doseOk": False, "coverage": "Yes", "coverageOk": True, "contact": ">20s", "contactOk": True, "touch": "Before", "touchOk": False},
        {"group": "Cleaners", "dose": "2", "doseOk": True, "coverage": "Yes", "coverageOk": True, "contact": ">20s", "contactOk": True, "touch": "After", "touchOk": True},
        {"group": "Porters", "dose": "0", "doseOk": False, "coverage": "No", "coverageOk": False, "contact": "<20s", "contactOk": False, "touch": "Before", "touchOk": False},
        {"group": "Visitors", "dose": "1", "doseOk": False, "coverage": "No", "coverageOk": False, "contact": "<20s", "contactOk": False, "touch": "Before", "touchOk": False},
    ],
    "dispenserStats": [
        {"location": "Bay A SPZ001", "totalDisp": 210, "volumeMl": 420, "price": "21.00"},
        {"location": "Bay B SPZ007", "totalDisp": 168, "volumeMl": 336, "price": "16.80"},
        {"location": "Bay C SPZ013", "totalDisp": 145, "volumeMl": 290, "price": "14.50"},
        {"location": "Bay D SPZ019", "totalDisp": 132, "volumeMl": 264, "price": "13.20"},
    ],
    "gloves": [
        {"group": "Nurses", "moment2": "90%", "moment3": "86%", "misuse": "9%"},
        {"group": "Doctors", "moment2": "76%", "moment3": "70%", "misuse": "16%"},
        {"group": "HCAs", "moment2": "84%", "moment3": "80%", "misuse": "11%"},
        {"group": "Nurse Students", "moment2": "81%", "moment3": "77%", "misuse": "13%"},
    ],
}

MONTH = {
    "groupSummary": [
        {"group": "Nurses", "total": 890, "moment1Comp": "86%", "moment1Non": "9%", "nonOpp": "5%"},
        {"group": "Doctors", "total": 620, "moment1Comp": "75%", "moment1Non": "15%", "nonOpp": "10%"},
        {"group": "HCAs", "total": 540, "moment1Comp": "83%", "moment1Non": "11%", "nonOpp": "6%"},
        {"group": "Nurse Students", "total": 240, "moment1Comp": "79%", "moment1Non": "13%", "nonOpp": "8%"},
        {"group": "Cleaners", "total": 380, "moment1Comp": "89%", "moment1Non": "7%", "nonOpp": "4%"},
        {"group": "Porters", "total": 175, "moment1Comp": "71%", "moment1Non": "19%", "nonOpp": "10%"},
        {"group": "Visitors", "total": 290, "moment1Comp": "74%", "moment1Non": "16%", "nonOpp": "10%"},
    ],
    "locationObs": [
        {"location": "Bay A SPZ001", "moment1Comp": 210, "moment1Non": 62, "nonOpp": 28, "failure": "Touched Before"},
        {"location": "Bay B SPZ007", "moment1Comp": 168, "moment1Non": 80, "nonOpp": 22, "failure": "Dose 0/1"},
        {"location": "Bay C SPZ013", "moment1Comp": 190, "moment1Non": 55, "nonOpp": 30, "failure": "Time <20s"},
        {"location": "Bay D SPZ019", "moment1Comp": 175, "moment1Non": 70, "nonOpp": 24, "failure": "Touched Before"},
        {"location": "Bay A SPZ003", "moment1Comp": 140, "moment1Non": 48, "nonOpp": 18, "failure": "No Rub"},
        {"location": "Bay B SPZ009", "moment1Comp": 125, "moment1Non": 40, "nonOpp": 15, "failure": "Dose 0/1"},
    ],
    "qualityCriteria": [
        {"group": "Nurses", "dose": "2", "doseOk": True, "coverage": "Yes", "coverageOk": True, "contact": ">20s", "contactOk": True, "touch": "After", "touchOk": True},
        {"group": "Doctors", "dose": "2", "doseOk": True, "coverage": "Yes", "coverageOk": True, "contact": ">20s", "contactOk": True, "touch": "After", "touchOk": True},
        {"group": "HCAs", "dose": "2", "doseOk": True, "coverage": "Yes", "coverageOk": True, "contact": ">20s", "contactOk": True, "touch": "After", "touchOk": True},
        {"group": "Nurse Students", "dose": "2", "doseOk": True, "coverage": "Yes", "coverageOk": True, "contact": "<20s", "contactOk": False, "touch": "After", "touchOk": True},
        {"group": "Cleaners", "dose": "2", "doseOk": True, "coverage": "Yes", "coverageOk": True, "contact": ">20s", "contactOk": True, "touch": "After", "touchOk": True},
        {"group": "Porters", "dose": "1", "doseOk": False, "coverage": "No", "coverageOk": False, "contact": "<20s", "contactOk": False, "touch": "Before", "touchOk": False},
        {"group": "Visitors", "dose": "1", "doseOk": False, "coverage": "No", "coverageOk": False, "contact": "<20s", "contactOk": False, "touch": "Before", "touchOk": False},
    ],
    "dispenserStats": [
        {"location": "Bay A SPZ001", "totalDisp": 890, "volumeMl": 1780, "price": "89.00"},
        {"location": "Bay B SPZ007", "totalDisp": 720, "volumeMl": 1440, "price": "72.00"},
        {"location": "Bay C SPZ013", "totalDisp": 640, "volumeMl": 1280, "price": "64.00"},
        {"location": "Bay D SPZ019", "totalDisp": 580, "volumeMl": 1160, "price": "58.00"},
    ],
    "gloves": [
        {"group": "Nurses", "moment2": "91%", "moment3": "87%", "misuse": "8%"},
        {"group": "Doctors", "moment2": "77%", "moment3": "71%", "misuse": "15%"},
        {"group": "HCAs", "moment2": "85%", "moment3": "81%", "misuse": "10%"},
        {"group": "Nurse Students", "moment2": "82%", "moment3": "78%", "misuse": "12%"},
    ],
}

BY_PERIOD = {"Today": TODAY, "This Week": WEEK, "This Month": MONTH}


def get_hand_hygiene(period: str = "Today") -> dict:
    return BY_PERIOD.get(period, TODAY)
