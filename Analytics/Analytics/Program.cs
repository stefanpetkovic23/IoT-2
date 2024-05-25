using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using AnalyticsService;
using MQTTnet.Client;

public class Program
{
    public static async Task Main(string[] args)
    {
        var mqttService = MqttService.Instance(); 

        
        var brokerAddress = "192.168.99.100"; // Adresa MQTT brokera
        var port = 1883; 
        var topicToSubscribe = new List<string> { "sensor_dummy/values", "eKuiper/anomalies" };

        try
        {

            await mqttService.ConnectAsync(brokerAddress, port);

           
            await mqttService.SubsribeToTopicsAsync(topicToSubscribe);

            Console.WriteLine("Connected to MQTT broker and subscribed to topics.");

            // Konfiguracija handlera za poruke
            mqttService.AddApplicationMessageReceived(MessageReceivedFunctionAsync);

            // Čekanje na unos sa tastature pre nego što se zatvori aplikacija
            Console.ReadLine();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }

    async Task MessageReceivedFunctionAsync(MqttApplicationMessageReceivedEventArgs args)
    {
        string payload = Encoding.UTF8.GetString(args.ApplicationMessage.Payload);

        Console.WriteLine($"Received message on topic: {args.ApplicationMessage.Topic}");
        Console.WriteLine($"Payload: {payload}");

        if (args.ApplicationMessage.Topic == "sensor_dummy/values")
        {
            // Slanje poruke na drugi topic
            await mqttService.PublishMessage("analytics/values", payload);
            Console.WriteLine($"Message forwarded to analytics/values topic.");
        }
    
    }
    }
}
