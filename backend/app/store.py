"""In-memory store. Swap this module for a DB later without changing routers."""

from copy import deepcopy

from app.data import catalog, heatmap, patient_care, testing as testing_data


class Store:
    def reset(self) -> None:
        self.events = testing_data.build_all_testing_events()
        self.alerts = deepcopy(catalog.ALERTS)
        self.devices = deepcopy(catalog.DEVICES)
        self.users = catalog.build_users()
        self.settings = deepcopy(catalog.SETTINGS)
        self.care_sections = patient_care.with_task_ids(deepcopy(patient_care.SECTIONS))
        self.heatmap_bays = heatmap.build_heatmap_bays()
        self.tokens: dict[str, dict] = {}

    def event_by_key(self, key: str) -> dict | None:
        for event in self.events:
            if event["key"] == key or event["id"] == key:
                return event
        return None


store = Store()
store.reset()
