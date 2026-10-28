using Microsoft.AspNetCore.Mvc;
using MobiPark.App.Presenters;
using MobiPark.Domain.Exceptions;
using MobiPark.Domain.Interfaces;
using MobiPark.Domain.Models;

namespace MobiPark.App.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParkingController : ControllerBase
{
    private readonly IParkingService _parkingService;
    private readonly IVehicleRepository _vehicleRepository;

    public ParkingController(IParkingService parkingService, IVehicleRepository vehicleRepository)
    {
        _parkingService = parkingService;
        _vehicleRepository = vehicleRepository;
    }

    [HttpGet("spaces")]
    public async Task<IActionResult> GetSpaces()
    {
        var spaces = await _parkingService.GetSpaces();
        var spacePresenters = spaces.Select(space => new ParkingSpacePresenter(space)).ToList();
        return Ok(spacePresenters);
    }

    [HttpPut("spaces/park")]
    public async Task<IActionResult> ParkCar(string licensePlate)
    {
        var user = (User)HttpContext.Items["User"]!;
        var vehicle = await _vehicleRepository.FindByPlate(licensePlate);
        if (vehicle.OwnerId != user.Id) throw new NotFoundException("Vehicle not found.");

        var result = await _parkingService.ParkVehicle(licensePlate);
        return Ok(result);
    }
}
