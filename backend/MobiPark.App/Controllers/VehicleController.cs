using Microsoft.AspNetCore.Mvc;
using MobiPark.App.DTO;
using MobiPark.App.Presenters;
using MobiPark.Domain.Exceptions;
using MobiPark.Domain.Interfaces;
using MobiPark.Domain.Models;
using MobiPark.Domain.Models.Vehicle.Engine;

namespace MobiPark.App.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehicleController : ControllerBase
{
    private readonly IVehicleRepository _vehicleRepository;

    public VehicleController(IVehicleRepository vehicleRepository)
    {
        _vehicleRepository = vehicleRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetVehicles()
    {
        var user = (User)HttpContext.Items["User"]!;
        var vehicles = await _vehicleRepository.GetVehiclesByOwner(user.Id);
        var vehiclePresenters = vehicles.ConvertAll(v => new VehiclePresenter(v));
        return Ok(vehiclePresenters);
    }

    [HttpGet("{licensePlate}")]
    public async Task<IActionResult> GetVehicle(string licensePlate)
    {
        var user = (User)HttpContext.Items["User"]!;
        var vehicle = await _vehicleRepository.FindByPlate(licensePlate);
        if (vehicle.OwnerId != user.Id) throw new NotFoundException("Vehicle not found.");
        return Ok(new VehiclePresenter(vehicle));
    }

    [HttpPost]
    public async Task<IActionResult> AddVehicle([FromBody] CreateVehicleDTO request)
    {
        var user = (User)HttpContext.Items["User"]!;
        var licensePlate = request.LicensePlate.ToDomainModel();

        Engine engine;

        switch (request.Engine.EngineType)
        {
            case "ElectricalEngine":
                var batteryCapacity = request.Engine.BatteryCapacity ??
                                      throw new ArgumentException("Battery capacity is required");
                var currentBatteryCapacity = request.Engine.CurrentBatteryCapacity ??
                                             throw new ArgumentException("Current battery capacity is required");
                engine = new ElectricalEngine(batteryCapacity, currentBatteryCapacity);
                break;
            case "ThermalEngine":
                engine = new ThermalEngine();
                break;
            default:
                throw new ArgumentException("Invalid engine type");
        }

        var vehicle = await _vehicleRepository.CreateVehicle(user.Id, request.Type, request.Maker, licensePlate, engine);
        return Ok(new VehiclePresenter(vehicle));
    }
}