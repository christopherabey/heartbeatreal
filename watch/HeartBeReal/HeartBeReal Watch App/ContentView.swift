import SwiftUI
import HealthKit

struct ContentView: View {
    @State private var heartRate: Double = 0.0  // State variable to hold heart rate
    @State private var anchor: HKQueryAnchor? // @State for mutable query anchor
    private var healthStore = HKHealthStore()
    
    var body: some View {
        ScrollView {
            VStack {
                Image(systemName: "heart.fill")
                    .imageScale(.large)
                    .foregroundStyle(.red)
                    .scaledToFit()
                
                Text("Heart Rate: \(Int(heartRate)) BPM")
                    .font(.headline)
                    .lineLimit(1)
                    .minimumScaleFactor(0.5)
                    .padding()
            }
            .onAppear(perform: startHeartRateQuery)  // Start the heart rate query when the view appears
        }
    }
    
    // Function to request authorization and start the real-time heart rate query
    private func startHeartRateQuery() {
        if HKHealthStore.isHealthDataAvailable() {
            let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate)!
            let dataTypes: Set = [heartRateType]
            
            healthStore.requestAuthorization(toShare: nil, read: dataTypes) { success, error in
                if success {
                    // If permission is granted, start the heart rate query
                    startRealTimeHeartRateQuery()
                } else if let error = error {
                    print("HealthKit authorization error: \(error.localizedDescription)")
                }
            }
        }
    }
    
    // Function to set up the real-time heart rate query using HKAnchoredObjectQuery
    private func startRealTimeHeartRateQuery() {
        let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate)!
        
        let query = HKAnchoredObjectQuery(
            type: heartRateType,
            predicate: nil,
            anchor: anchor,
            limit: HKObjectQueryNoLimit
        ) { (query, samples, deletedObjects, newAnchor, error) in
            // Save the new anchor
            DispatchQueue.main.async {
                self.anchor = newAnchor
                
                // Process the heart rate samples
                processHeartRateSamples(samples)
            }
        }
        
        // Set an update handler for real-time changes
        query.updateHandler = { (query, samples, deletedObjects, newAnchor, error) in
            DispatchQueue.main.async {
                self.anchor = newAnchor
                processHeartRateSamples(samples)
            }
        }
        
        // Execute the query
        healthStore.execute(query)
    }
    
    // Function to process the heart rate samples and update the heart rate value
    private func processHeartRateSamples(_ samples: [HKSample]?) {
        guard let samples = samples as? [HKQuantitySample] else {
            return
        }
        
        // Get the latest heart rate sample
        if let latestSample = samples.last {
            let heartRateUnit = HKUnit.count().unitDivided(by: HKUnit.minute())
            let heartRateValue = latestSample.quantity.doubleValue(for: heartRateUnit)
            
            if heartRateValue > 100 {
                sendGetRequest()
            }
            
            // Update the heart rate on the main thread
            DispatchQueue.main.async {
                self.heartRate = heartRateValue
            }
        }
    }
    
    func sendGetRequest() {
        // Define the URL
        guard let url = URL(string: "https://example.com/api/endpoint") else {
            print("Invalid URL")
            return
        }

        // Create a URL session
        let session = URLSession.shared

        // Create a GET request
        var request = URLRequest(url: url)
        request.httpMethod = "GET"

        // Send the request
        let task = session.dataTask(with: request) { (data, response, error) in
            // Handle the response
            if let error = error {
                print("Error occurred: \(error)")
                return
            }

            guard let data = data, let response = response as? HTTPURLResponse, response.statusCode == 200 else {
                print("Invalid response")
                return
            }

            // Process the response data
            if let responseString = String(data: data, encoding: .utf8) {
                print("Response data: \(responseString)")
            }
        }

        // Start the task
        task.resume()
    }
}

#Preview {
    ContentView()
}
