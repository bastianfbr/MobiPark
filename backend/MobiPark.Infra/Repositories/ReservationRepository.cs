using Microsoft.EntityFrameworkCore;
using MobiPark.Domain.Exceptions;
using MobiPark.Domain.Interfaces;
using MobiPark.Domain.Models;
using MobiPark.Infra.Entities;

namespace MobiPark.Infra.Repositories;

public class ReservationRepository : IReservationRepository
{
    private readonly ApplicationDbContext _context;

    public ReservationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public Reservation Save(Reservation reservation)
    {
        var entity = new ReservationEntity(reservation);
        _context.Add(entity);
        _context.SaveChanges();
        return reservation;
    }

    public List<Reservation> GetReservationsByOwner(int ownerId)
    {
        return _context.Reservations
            .Include(r => r.Vehicle)
            .Include(r => r.ParkingSpace)
            .Where(r => r.Vehicle.OwnerId == ownerId)
            .AsEnumerable()
            .Select(r => r.ToDomainModel())
            .ToList();
    }

    public Reservation FindByPlate(string plate)
    {
        var reservation = _context.Reservations
            .Include(r => r.Vehicle)
            .Include(r => r.ParkingSpace)
            .FirstOrDefault(r => r.Vehicle.Plate == plate);
        if (reservation == null) throw new NotFoundException("Reservation not found.");
        return reservation.ToDomainModel();
    }

    public void Cancel(Reservation reservation)
    {
        var entity = _context.Reservations
            .FirstOrDefault(r => r.Vehicle.Plate == reservation.Vehicle.LicensePlate.Value);
        if (entity == null) throw new NotFoundException("Reservation not found.");
        _context.Reservations.Remove(entity);
        _context.SaveChanges();
    }
}
