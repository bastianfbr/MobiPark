using Microsoft.EntityFrameworkCore;
using MobiPark.Domain.Exceptions;
using MobiPark.Domain.Interfaces;
using MobiPark.Domain.Models.Vehicle;
using MobiPark.Domain.Models.Vehicle.Engine;
using MobiPark.Domain.Models.Vehicle.LicensePlate;
using MobiPark.Infra.Entities;

namespace MobiPark.Infra.Repositories;

public class VehicleRepository : IVehicleRepository
{
    private readonly ApplicationDbContext _context;

    public VehicleRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Vehicle> Save(Vehicle vehicle)
    {
        var entiy = new VehicleEntity(vehicle);
        await _context.AddAsync(entiy);
        await _context.SaveChangesAsync();
        return vehicle;
    }

    public async Task<Vehicle> CreateVehicle(int ownerId, string type, string maker, AbstractLicensePlate licensePlate,
        Engine engine)
    {
        Vehicle vehicle = type switch
        {
            "Car" => new Car(maker, licensePlate, engine),
            "Motorcycle" => new Motorcycle(maker, licensePlate, engine),
            _ => throw new InvalidOperationException("Unknown vehicle type")
        };
        vehicle.OwnerId = ownerId;
        await _context.Vehicles.AddAsync(new VehicleEntity(vehicle));
        await _context.SaveChangesAsync();
        return vehicle;
    }

    public async Task<List<Vehicle>> GetVehiclesByOwner(int ownerId)
    {
        return await _context.Vehicles
            .Where(v => v.OwnerId == ownerId)
            .Select(v => v.ToDomainModel())
            .ToListAsync();
    }

    public async Task<Vehicle> FindByPlate(string licensePlate)
    {
        var vehicle = await _context.Vehicles
            .FirstOrDefaultAsync(v => v.Plate == licensePlate);
        if (vehicle == null) throw new NotFoundException("Vehicle not found.");
        return vehicle.ToDomainModel();
    }
}