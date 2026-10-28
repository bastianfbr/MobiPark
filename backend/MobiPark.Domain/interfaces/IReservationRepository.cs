using MobiPark.Domain.Models;

namespace MobiPark.Domain.Interfaces;

public interface IReservationRepository
{
    Reservation Save(Reservation reservation);
    List<Reservation> GetReservationsByOwner(int ownerId);
    Reservation FindByPlate(string plate);
    void Cancel(Reservation reservation);
}