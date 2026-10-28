using MobiPark.Domain.Models.Vehicle;
using MobiPark.Domain.Models.Vehicle.Engine;

namespace MobiPark.App.Presenters;

public class VehiclePresenter
{
    public VehiclePresenter(Vehicle vehicle)
    {
        Type = vehicle.GetType().Name;
        Maker = vehicle.Maker;
        LicensePlateNumber = vehicle.LicensePlate.Value;
        Engine = vehicle.Engine is ElectricalEngine ? "Electrical" : "Thermal";
    }

    public string Type { get; private set; }
    public string Maker { get; private set; }
    public string LicensePlateNumber { get; private set; }
    public string Engine { get; private set; }
}